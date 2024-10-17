import os
import shutil
import json
import re
import subprocess
import difflib
import tqdm
import csv
from collections import defaultdict
import definitionparser


LANGUAGE_CODES = {
    'ar': ("Cp1252", "Arabic"),
    'ca': ("ISO-8859-15", "Catalan"),
    'ch': ("UTF-8", "Traditional Chinese (zh-Hant)"),
    'cn': ("UTF-8", "Simplified Chinese (zh-Hans)"),
    'cs': ("Cp1250", "Czech"),
    'da': ("Cp1252", "Danish"),
    'de': ("Cp1252", "German"),
    'en': ("UTF-8", "English"),
    'es': ("Cp1252", "Spanish"),
    'fi': ("Cp1252", "Finnish"),
    'fr': ("Cp1252", "French"),
    'hu': ("Cp1250", "Hungarian"),
    'id': ("UTF-8", "Indonesian"),
    'it': ("Cp1252", "Italian"),
    'jp': ("UTF-8", "Japanese"),
    'ko': ("UTF-16", "Korean"),
    'nl': ("Cp1252", "Dutch"),
    'no': ("Cp1252", "Norwegian"),
    'ph': ("UTF-8", "Filipino"),
    'pl': ("Cp1250", "Polish"),
    'pt': ("Cp1252", "Portuguese"),
    'pt-br': ("Cp1252", "Portuguese (Brazilian)"),
    'ro': ("UTF-8", "Romanian"),
    'ru': ("Cp1251", "Russian"),
    'th': ("UTF-8", "Thai"),
    'tr': ("Cp1254", "Turkish"),
    'ua': ("Cp1251", "Ukrainian")
}


def load_language_data(csv_file='language_data.csv'):
    language_data = defaultdict(lambda: defaultdict(lambda: defaultdict(dict)))
    languages = []

    try:
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            # Extract language codes from the header (excluding 'key_path')
            languages = reader.fieldnames[1:]  # ['en', 'es', 'fr', ...]

            for row in reader:
                key_path = row['key_path']
                for lang in languages:
                    value = row[lang]
                    if not value:
                        continue  # Skip empty translations

                    keys = key_path.split('.')
                    current_level = language_data[lang]

                    # Automatically create nested dictionaries using defaultdict
                    for key in keys[:-1]:
                        current_level = current_level[key]

                    current_level[keys[-1]] = value
    except FileNotFoundError:
        print(f"Error: The file {csv_file} was not found.")
    except Exception as e:
        print(f"An error occurred while loading {csv_file}: {e}")

    return language_data


# Remove the entire output folder
def cleanup():
    folder = 'output'
    if os.path.exists(folder):
        shutil.rmtree(folder)
        print(f"Folder '{folder}' was removed.")
        return True
    else:
        print(f"Folder '{folder}' does not exist.")
        return False


def load_definitions():
    definitions_file = 'output/json/movabledefinitions.json'
    try:
        with open(definitions_file, 'r') as f:
            definitions = json.load(f)
    except FileNotFoundError:
        print(f"Error: {definitions_file} not found.")
        definitions = {}
    except json.JSONDecodeError:
        print(f"Error: Failed to decode {definitions_file}.")
        definitions = {}
    return definitions


def load_item_translation():
    item_translation_file = 'resources/translate/EN/ItemName_EN.txt'
    item_translations = {}
    if os.path.exists(item_translation_file):
        with open(item_translation_file, 'r', encoding='utf-8') as f:
            content = f.read()

        pattern = r'ItemName_Base\.(\S+)\s*=\s*"(.*?)",'
        matches = re.findall(pattern, content)
        for item_id, item_name in matches:
            item_translations[item_id] = item_name
    else:
        print(f"Error: Item translation file {item_translation_file} not found.")
    return item_translations


def facing_sort_key(tile_info):
    facing_priority = {'S': 1, 'W': 2, 'N': 3, 'E': 0}
    return facing_priority.get(tile_info['properties'].get('generic', {}).get('Facing', 'E'), 3)


# Create named_tiles and move to article generation
def processing():
    json_file = 'output/json/newtiledefinitions.tiles.json'

    try:
        with open(json_file, 'r') as f:
            tile_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: {json_file} not found.")
        return
    except json.JSONDecodeError:
        print(f"Error: Failed to decode {json_file}.")
        return

    # Process tiles and save into moved_tables
    processed_data, unique_names = list_tiles(tile_data)

    print(f"Number of unique names found: {len(unique_names)}")

    output_dir = 'output/json'
    output_file = os.path.join(output_dir, 'named_tiles.json')

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    with open(output_file, 'w') as f:
        json.dump(processed_data, f, indent=4)

    print(f"Named tiles saved to: {output_file}")

    # Run definition parser
    definitionparser.main()

    # Move to article generation loop
    article_generation()


# Process the raw tiles json finding all named tiles, exclude specifically named tiles.
def list_tiles(tile_data):
    processed_tiles = {}
    unique_processed_names = set()

    for tile_id, tile_info in tile_data.items():
        properties = tile_info.get('properties', {})
        generic = properties.get('generic', {})
        group_name = generic.get('GroupName')
        custom_name = generic.get('CustomName')

        # Skip certain tiles based on custom name
        if custom_name == "CustomName":
            continue
        if custom_name in ["Door", "Sign", "Curtain", "Painting", "Trash", "Window", "Fence gate", "Flowerbed"] and not group_name:
            continue
        if not group_name and not custom_name:
            continue

        # Format as GroupName_CustomName, else use whichever is present
        if group_name and custom_name:
            processed_name = f"{group_name}_{custom_name}".replace(" ", "_")
        elif group_name:
            processed_name = group_name.replace(" ", "_")
        elif custom_name:
            processed_name = custom_name.replace(" ", "_")

        unique_processed_names.add(processed_name)
        if processed_name not in processed_tiles:
            processed_tiles[processed_name] = {}

        formatted_tile = {
            "name": tile_id,
            "id": tile_info.get("id"),
            "type": tile_info.get("type"),
            "tileSheetIndex": tile_info.get("tileSheetIndex"),
            "properties": properties
        }

        processed_tiles[processed_name][tile_id] = formatted_tile

    # Sort each processed name's tiles by Facing
    for processed_name, tiles in processed_tiles.items():
        sorted_tiles = sorted(tiles.values(), key=facing_sort_key)
        processed_tiles[processed_name] = {tile["name"]: tile for tile in sorted_tiles}

    return processed_tiles, unique_processed_names


# Function to load translation files from all subdirectories
def load_translation_files():
    translation_files = {}
    base_dir = 'resources/translate'

    if not os.path.exists(base_dir):
        print(f"Error: Translation folder {base_dir} does not exist.")
        return translation_files

    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.startswith('Moveables_') and file.endswith('.txt'):
                lang_code = os.path.basename(root).lower()

                if lang_code in LANGUAGE_CODES:
                    encoding, language_name = LANGUAGE_CODES[lang_code]
                    file_path = os.path.join(root, file)

                    try:
                        with open(file_path, 'r', encoding=encoding) as f:
                            translation_files[lang_code] = f.read()

                    # Use UTF-8 if error
                    except UnicodeDecodeError:
                        try:
                            with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
                                translation_files[lang_code] = f.read()
                        except Exception as fallback_error:
                            print(f"Failed to read {file_path} with 'utf-8': {fallback_error}")
                    except Exception as e:
                        print(f"General error reading file {file_path}: {e}")

    return translation_files


def extract_translation(translation_data, tile_name):
    pattern = rf'{tile_name}\s*=\s*"(.*?)"'
    match = re.search(pattern, translation_data)
    if match:
        return match.group(1)
    else:
        return tile_name


def generate_header(lang_code, item_name):
    if lang_code.lower() != "en":
        header = f"{{{{Title|{item_name}}}}}\n"
        header += "{{Header|Project Zomboid|Tiles}}\n"
        header += "{{Page version|41.78.16}}\n"
        header += "{{Autogenerated|B41_Tiles}}\n"
        header += "{{AutoT}}"
    else:
        header = "{{Header|Project Zomboid|Tiles}}\n"
        header += "{{Page version|41.78.16}}\n"
        header += "{{Autogenerated|B41_Tiles}}"

    return header


def generate_infobox(processed_name, tiles, lang_code, definitions, version):
    infobox = "{{Infobox tile/sandbox\n"
    params = []

    # Fetch the translated name for the current language code, if available
    item_name = extract_translation(translations.get(lang_code, ''), processed_name)
    name_param = f"|name={item_name}\n"
    params.append(name_param)

    # Initialize variables
    icons_params = []
    sprite_ids_params = []
    tile_ids_params = []
    weights = []
    bed_types = []
    is_low_flags = []
    iso_type_param = ""
    is_table_top_param = ""
    pickup_tool_param = ""
    place_tool_param = ""
    capacity_param = ""
    freezer_capacity_param = ""
    liquid_capacity_param = ""
    bed_type_param = ""
    is_low_param = ""
    disassemble_skill_param = ""
    disassemble_tool_params = []
    pickup_level_param = ""
    pickup_skill_param = ""

    # Initialize dictionaries
    facing_count = {"S": 0, "W": 0, "N": 0, "E": 0}
    directions = language_data.get(lang_code, {}).get('directions', {})
    facing_map = {
        "S": directions.get('S', 'South'),
        "W": directions.get('W', 'West'),
        "N": directions.get('N', 'North'),
        "E": directions.get('E', 'East')
    }

    tool_type_map = {
        "Hammer": "tag",
        "Shovel": "tag",
        "Wrench": "tool",
        "Electrician": "tool",
        "Crowbar": "tool"
    }

    tool_value_map = {
        "Hammer": "Hammer",
        "Shovel": "DigPlow",
        "Wrench": "{{ll|Wrench}}",
        "Electrician": "{{ll|Screwdriver}}",
        "Crowbar": "{{ll|Crowbar}}"
    }

    tool_skill_map = {
        "Hammer": "{{ll|Carpentry}}",
        "Shovel": "{{ll|Farming}}",
        "Wrench": "None",
        "Electrician": "{{ll|Electrical}}",
        "Crowbar": "{{ll|Carpentry}}"
    }

    # Initialize booleans
    iso_type_added = False
    capacity_added = False
    freezer_capacity_added = False
    pickup_tool_added = False
    place_tool_added = False
    is_table_top_added = False

    # Main loop for tiles
    for index, (tile_id, tile_info) in enumerate(tiles.items(), start=1):
        icon_value = tile_info.get('name', '')
        properties = tile_info.get('properties', {})
        generic = properties.get('generic', {})
        facing = generic.get('Facing', properties.get('Facing', ''))
        weight = generic.get('PickUpWeight', properties.get('PickUpWeight', None))
        pickup_tool = generic.get('PickUpTool', None)
        place_tool = generic.get('PlaceTool', None)
        bed_type = generic.get('BedType', properties.get('BedType', None))
        pickup_level = generic.get('PickUpLevel', None)
        is_table_top = generic.get('IsTableTop', None)
        is_low = generic.get('IsLow', None)
        capacity = generic.get('ContainerCapacity', None)
        liquid_capacity = generic.get('waterMaxAmount', None)
        freezer_capacity = generic.get('FreezerCapacity', None)
        custom_item = generic.get('CustomItem', None)
        material = generic.get('Material', None)

        # Set weight
        if weight is not None:
            weights.append(int(weight) / 10)
        else:
            weights.append('-')

        # Set bed type
        bed_types_data = language_data.get(lang_code, {}).get('bed_types', {})
        if bed_type is not None:
            bed_type_translation = bed_types_data.get(bed_type, bed_type)
            bed_types.append(bed_type_translation)

        # Set islow
        if is_low is not None:
            is_low_translation = language_data.get(lang_code, {}).get('true', 'True')
            is_low_flags.append(is_low_translation)

        # |type=
        if not iso_type_added:
            container_value = generic.get('container', None)
            if container_value:
                iso_type_param = f"|type={container_value}\n"
                iso_type_added = True

        # |is_table_top=
        if is_table_top and not is_table_top_added:
            is_table_top_param = "|is_table_top=True\n"
            is_table_top_added = True



        # |pickup_tool=
        if pickup_tool and not pickup_tool_added:
            tool_type = tool_type_map.get(pickup_tool, None)
            if tool_type == "tool":
                pickup_tool_param = f"|pickup_tool={{{{ll|{tool_value_map[pickup_tool]}}}}}\n"
            elif tool_type == "tag":
                pickup_tool_param = f"|pickup_tool={{{{ll|{tool_value_map[pickup_tool]}}}}}\n"
            pickup_tool_added = True

            # |pickup_skill=
            pickup_skill = tool_skill_map.get(pickup_tool, "None")
            if pickup_skill != "None":
                pickup_skill_param = f"|pickup_skill={pickup_skill}\n"

        # |place_tool=
        if place_tool and not place_tool_added:
            tool_type = tool_type_map.get(place_tool, None)
            if tool_type == "tool":
                place_tool_param = f"|place_tool={{{{ll|{tool_value_map[place_tool]}}}}}\n"
            elif tool_type == "tag":
                place_tool_param = f"|place_tool={{{{ll|{tool_value_map[place_tool]}}}}}\n"
            place_tool_added = True

        # |pickup_level=
        if pickup_level and not pickup_level_param:
            pickup_level_param = f"|pickup_level={pickup_level}\n"

        # |capacity= and |freezer_capacity=
        if 'container' in generic:
            if capacity and not capacity_added:
                capacity_param = f"|capacity={capacity}\n"
                capacity_added = True
            if freezer_capacity and not freezer_capacity_added:
                freezer_capacity_param = f"|freezer_capacity={freezer_capacity}\n"
                freezer_capacity_added = True

        # |liquid_capacity=
        if liquid_capacity:
            liquid_capacity_param = f"|liquid_capacity={liquid_capacity}\n"

        # |icon= and |icon_name=
        sprite_label = language_data.get(lang_code, {}).get('sprite', 'sprite')
        if index == 1:
            icons_params.append(f"|icon={icon_value}.png\n")
            icons_params.append(f"|icon_name={facing_map.get(facing, '')} {sprite_label}\n")
        else:
            icons_params.append(f"|icon{index}={icon_value}.png\n")
            icons_params.append(f"|icon_name{index}={facing_map.get(facing, '')} {sprite_label}\n")

        # |sprite_id= and |tile_id=
        sprite_id = tile_info.get('name', '')
        tile_id_value = tile_info.get('id', '')
        if index == 1:
            sprite_ids_params.append(f"|sprite_id={sprite_id}\n")
            tile_ids_params.append(f"|tile_id={tile_id_value}\n")
        else:
            sprite_ids_params.append(f"|sprite_id{index}={sprite_id}\n")
            tile_ids_params.append(f"|tile_id{index}={tile_id_value}\n")

    # |item_id=
    if custom_item:
        item_id_param = f"|item_id={custom_item}\n"
    else:
        item_id_param = r"|item_id=Moveables.{sprite_id}" + "\n"

    # |weight=
    if len(set(weights)) == 1 and weights[0] != '-':
        weight_param = f"|weight={weights[0]:.1f}\n"
    else:
        formatted_weights = ['{:.1f}'.format(w) if w != '-' else w for w in weights]
        weight_param = f"|weight={'<br>'.join(formatted_weights)}\n"

    # |size=
    max_size = max(facing_count.values())
    if max_size == 0:
        max_size = 1
    size_param = f"|size={max_size}\n"

    # |bed_type=
    if len(set(bed_types)) == 1 and bed_types:
        bed_type_param = f"|bed_type={bed_types[0]}\n"

    # |is_low=
    if len(set(is_low_flags)) == 1 and is_low_flags:
        is_low_param = f"|is_low={is_low_flags[0]}\n"

    # Disassemble parameters
    if material:
        # Look up scrap definition
        scrap_definitions = definitions.get('scrap_definitions', {})
        scrap_def = scrap_definitions.get(material, None)
        if scrap_def:
            # Get the perk
            perk = scrap_def.get('_perk', None)
            # Map the perk to the skill using the mapping
            perk_to_skill = {
                'Perks.Woodwork': '{{ll|Carpentry}}',
                'Perks.Electricity': '{{ll|Electrical}}',
                'Perks.Farming': '{{ll|Farming}}',
                'Perks.MetalWelding': '{{ll|Metalworking}}',
                'Perks.Strength': '{{ll|Strength}}',
                'Perks.MAX': 'Unknown'
            }
            skill = perk_to_skill.get(perk, 'Unknown')
            disassemble_skill_param = f"|disassemble_skill={skill}\n"

            # Get tools
            tools = scrap_def.get('_tools', [])
            tools2 = scrap_def.get('_tools2', [])
            all_tools = tools + tools2

            tool_index = 1
            tool_names_added = set()
            for tool in all_tools:
                tool_items = []
                tool_definitions = definitions.get('tool_definitions', {})
                if tool in tool_definitions:
                    tool_def_entry = tool_definitions[tool]
                    tool_items = tool_def_entry.get('items', [])
                else:
                    tool_items = [tool]

                for item in tool_items:
                    if item.startswith('Base.'):
                        item_id = item[5:]
                    else:
                        item_id = item

                    tag_string = language_data.get(lang_code, {}).get('tag', '')

                    if item.startswith('Tag.'):
                        item_name = item[4:]
                        if lang_code.lower() != "en":
                            display_name = f"[[Item tag/{lang_code}#tag-{item_name}|{item_name} ({tag_string})]]"
                        else:
                            display_name = f"[[Item tag#tag-{item_name}|{item_name} ({tag_string})]]"
                    else:
                        # Look up the translated name
                        translated_name = item_translations.get(item_id, item_id)
                        display_name = f"{{{{ll|{translated_name}}}}}"

                    # Avoid duplicates
                    if display_name in tool_names_added:
                        continue
                    tool_names_added.add(display_name)

                    if tool_index == 1:
                        tool_param_name = f"|disassemble_tool"
                    else:
                        tool_param_name = f"|disassemble_tool{tool_index}"
                    tool_param_value = display_name
                    disassemble_tool_params.append(f"{tool_param_name}={tool_param_value}\n")
                    tool_index += 1

    # Set params
    params.extend(icons_params)
    params.append("|category=Moveable\n")
    params.append(weight_param)
    params.append(iso_type_param)
    params.append(capacity_param)
    params.append(size_param)
    params.append(freezer_capacity_param)
    params.append(liquid_capacity_param)
    params.append(is_table_top_param)
    params.append(bed_type_param)
    params.append(is_low_param)
    params.append(pickup_skill_param)
    params.append(pickup_level_param)
    params.append(pickup_tool_param)
    params.append(place_tool_param)
    params.append(disassemble_skill_param)
    params.extend(disassemble_tool_params)
    params.append(item_id_param)
    params.extend(sprite_ids_params)
    params.extend(tile_ids_params)
    params.extend(f"|infobox_version={version}\n")

    # Build the infobox
    infobox += ''.join(filter(None, params))
    infobox += "}}"

    output_dir = os.path.join('output', lang_code, 'infobox')
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Use processed_name as the filename
    output_file = os.path.join(output_dir, f"{processed_name}.txt")

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(infobox)

    return infobox


def generate_intro(lang_code, item_name):
    intro_template = language_data.get(lang_code, {}).get('intro', '')
    intro = intro_template.format(item_name=item_name)
    return intro


def generate_usage(lang_code, tiles):
    usage = ""
    usage_sentences = []

    # Use the first tile's data as representative
    first_tile_info = next(iter(tiles.values()))
    properties = first_tile_info.get('properties', {})
    generic = properties.get('generic', {})
    container = generic.get('container', '').lower()
    container_capacity = generic.get('ContainerCapacity', '')
    bed_type = generic.get('BedType', '')
    custom_item = generic.get('CustomItem', '')

    # Map bed_type to bed_quality
    bed_types_data = language_data.get(lang_code, {}).get('bed_types', {})
    bed_quality_map = {
        "badBed": bed_types_data.get('badBed', 'Bad'),
        "averageBed": bed_types_data.get('averageBed', 'Average'),
        "goodBed": bed_types_data.get('goodBed', 'Good'),
    }
    bed_quality = bed_quality_map.get(bed_type, '')

    usage_data = language_data.get(lang_code, {}).get('usage', {})

    if container in ["stove", "microwave"]:
        sentence_template = usage_data.get('stove', '')
        usage_sentences.append(sentence_template.format(capacity=container_capacity))

    elif container in ["woodstove", "barbecue"]:
        sentence_template = usage_data.get('woodstove', '')
        usage_sentences.append(sentence_template.format(capacity=container_capacity))

    elif container == "clothingwasher":
        sentence_template = usage_data.get('clothingwasher', '')
        usage_sentences.append(sentence_template.format(capacity=container_capacity))

    elif container == "clothingdryerbasic":
        sentence_template = usage_data.get('clothingdryerbasic', '')
        usage_sentences.append(sentence_template.format(capacity=container_capacity))

    elif container in ["crate", "medicine", "counter", "shelves", "metal_shelves", "wardrobe", "sidetable", "dresser",
                       "desk", "filingcabinet", "displaycasebakery", "bin", "cashregister", "vendingsnack", "vendingpop",
                       "clothingrack", "displaycasebutcher", "grocerstand", "displaycase", "smallcrate", "smallbox", "overhead",
                       "postbox", "corn", "locker", "dishescabinet", "restaurantdisplay", "toolcabinet", "militarycrate",
                       "militarylocker"]:

        if container_capacity not in [0, '', '-', 'unknown']:
            sentence_template = usage_data.get('container_storage', '')
            usage_sentences.append(sentence_template.format(capacity=container_capacity))

    elif container == "fridge":
        fridge_capacity = generic.get('ContainerCapacity', 'unknown')
        freezer_capacity = generic.get('FreezerCapacity', 'unknown')
        sentence_template = usage_data.get('fridge', '')
        usage_sentences.append(sentence_template.format(fridge_capacity=fridge_capacity, freezer_capacity=freezer_capacity))

    if bed_type:
        sentence_template = usage_data.get('bed', '')
        usage_sentences.append(sentence_template.format(bed_quality=bed_quality))

    if custom_item not in ["-", ""]:
        if custom_item.startswith('Base.'):
            item_id = custom_item[5:]
        else:
            item_id = custom_item

        translated_name = item_translations.get(item_id, item_id)
        item_link = f"{{{{ll|{translated_name}}}}}"
        sentence_template = usage_data.get('custom_item', '')
        usage_sentences.append(sentence_template.format(custom_item=item_link))
    else:
        sentence_template = usage_data.get('generic_item', '')
        usage_sentences.append(sentence_template)

    usage_content = ' '.join(usage_sentences)

    if usage_content:
        usage_header = language_data.get(lang_code, {}).get('headers', {}).get('Usage', 'Usage')
        usage += f"\n=={usage_header}==\n{usage_content}"

    return usage


def generate_crafting(lang_code, tiles, definitions):
    first_tile_info = next(iter(tiles.values()))
    properties = first_tile_info.get('properties', {})
    generic = properties.get('generic', {})
    can_scrap = 'CanScrap' in generic
    can_break = 'CanBreak' in generic
    crafting_header = language_data.get(lang_code, {}).get('headers', {}).get('crafting', 'Crafting')

    if not can_scrap and not can_break:
        return ""

    crafting = f"\n=={crafting_header}=="

    if can_scrap:
        crafting += generate_disassembly_section(lang_code, generic, definitions)

    if can_break:
        crafting += generate_breakage_section(lang_code, generic, definitions)

    return crafting


def generate_disassembly_section(lang_code, generic, definitions):
    crafting_strings = language_data.get(lang_code, {}).get('crafting_strings', {})
    scrap_items = definitions.get('scrap_items', [])
    items_collected = []
    materials = []

    for key in ['Material', 'Material2', 'Material3']:
        material = generic.get(key, None)
        if material:
            materials.append(material)

    if not materials:
        return ""

    section = "\n" + crafting_strings.get('disassembly_intro', "The following table contains the materials that can drop when disassembling this tile.") + "\n"

    table = '{| class="wikitable theme-red"\n'
    table += '|+ ' + crafting_strings.get('base_chance_note', 'Base chance is not a percentage, but can provide a basic idea of rarity.') + '\n'
    table += '|-\n'
    table += '! colspan="4" | ' + crafting_strings.get('disassembly_materials', 'Disassembly materials') + '\n'
    table += '|-\n'
    table += '! ' + crafting_strings.get('material', 'Material') + '\n'
    table += '! ' + crafting_strings.get('amount_of_tries', 'Amount of tries') + '\n'
    table += '! ' + crafting_strings.get('base_chance', 'Base chance') + '\n'
    table += '! ' + crafting_strings.get('maximum_amount', 'Maximum amount') + '\n'

    for material in materials:
        for item_entry in scrap_items:
            if item_entry.get('_material') == material:
                item_name = item_entry.get('_returnItem', '')
                amount_of_tries = item_entry.get('_maxAmount', '')
                base_chance = item_entry.get('_chancePerRoll', '')
                max_amount = item_entry.get('_maxAmount', '')

                if item_name.startswith('Base.'):
                    item_id = item_name[5:]
                else:
                    item_id = item_name

                translated_name = item_translations.get(item_id, item_id)

                items_collected.append({
                    'material': material,
                    'item': item_id,
                    'translated_name': translated_name,
                    'amount_of_tries': amount_of_tries,
                    'base_chance': base_chance,
                    'max_amount': max_amount
                })

    for item in items_collected:
        table += '|-\n'
        table += '| {{{{ll|{}}}}}\n'.format(item['translated_name'])
        table += '| {}\n'.format(item['amount_of_tries'])
        table += '| {}\n'.format(item['base_chance'])
        table += '| {}\n'.format(item['max_amount'])

    unusable_items_collected = []
    scrap_definitions = definitions.get('scrap_definitions', {})

    for material in materials:
        scrap_def = scrap_definitions.get(material, {})
        unusable_item = scrap_def.get('_unusableItem', None)
        if unusable_item:
            if isinstance(unusable_item, dict):
                for item_name in unusable_item.keys():
                    if item_name.startswith('Base.'):
                        item_id = item_name[5:]
                    else:
                        item_id = item_name

                    translated_name = item_translations.get(item_id, item_id)
                    unusable_items_collected.append({'item_id': item_id, 'translated_name': translated_name})

            elif isinstance(unusable_item, str):
                if unusable_item.startswith('Base.'):
                    item_id = unusable_item[5:]
                else:
                    item_id = unusable_item

                translated_name = item_translations.get(item_id, item_id)
                unusable_items_collected.append({'item_id': item_id, 'translated_name': translated_name})

    if unusable_items_collected:
        table += '|-\n'
        table += '! colspan="4" | ' + crafting_strings.get('on_failed_dismantle', 'On failed dismantle') + '\n'

        for item in unusable_items_collected:
            table += '|-\n'
            table += '| colspan="4" | {{{{ll|{}}}}}\n'.format(item['translated_name'])

    table += '|}\n'
    section += table

    return section


def generate_breakage_section(lang_code, generic, definitions):
    crafting_strings = language_data.get(lang_code, {}).get('crafting_strings', {})
    material_definitions = definitions.get('material_definitions', {})
    items_collected = []
    materials = []

    for key in ['Material', 'Material2', 'Material3']:
        material = generic.get(key, None)
        if material:
            materials.append(material)

    if not materials:
        return ""

    section = "\n" + crafting_strings.get('breakage_intro', 'Breakage occurs when the {{ll|player}} fails at picking up an item.') + "\n"

    table = '{| class="wikitable theme-red sortable"\n'
    table += '|-\n'
    table += '! colspan="3" | ' + crafting_strings.get('breakage_materials', 'Breakage materials') + '\n'
    table += '|-\n'
    table += '! ' + crafting_strings.get('item_dropped', 'Item dropped') + '\n'
    table += '! ' + crafting_strings.get('maximum_amount', 'Maximum amount') + '\n'
    table += '! ' + crafting_strings.get('chance_per_roll', 'Chance per roll') + '\n'

    for material in materials:
        items = material_definitions.get(material, [])
        for item_entry in items:
            item_name = item_entry.get('returnItem', '')
            max_amount_dropped = item_entry.get('maxAmount', '')
            chance_per_roll = item_entry.get('chancePerRoll', '')

            if item_name.startswith('Base.'):
                item_id = item_name[5:]
            else:
                item_id = item_name

            translated_name = item_translations.get(item_id, item_id)

            items_collected.append({
                'material': material,
                'item': item_id,
                'translated_name': translated_name,
                'max_amount_dropped': max_amount_dropped,
                'chance_per_roll': chance_per_roll
            })

    for item in items_collected:
        table += '|-\n'
        table += '| {{{{ll|{}}}}}\n'.format(item['translated_name'])
        table += '| {}\n'.format(item['max_amount_dropped'])
        table += '| {}\n'.format(item['chance_per_roll'])

    table += '|}\n'
    section += table

    return section


def generate_sprites(lang_code, tiles):
    sprites_header = language_data.get(lang_code, {}).get('headers', {}).get('sprites', 'Sprites')
    sprites = f"\n=={sprites_header}==\n"

    # If there are multiple tiles, create the gallery
    if len(tiles) > 0:
        sprites += '<div class="gallery-list">\n'
        for tile_id, tile_info in tiles.items():
            sprite = tile_info.get('name', '')
            # Map facing value
            properties = tile_info.get('properties', {})
            generic = properties.get('generic', {})
            facing = generic.get('Facing', properties.get('Facing', ''))

            directions = language_data.get(lang_code, {}).get('directions', {})
            facing_mapped = directions.get(facing, facing)

            sprite_label = language_data.get(lang_code, {}).get('sprite', 'sprite')

            sprite_name = f"{facing_mapped} {sprite_label}"
            sprites += f'<div>[[File:{sprite}.png]] <br> {sprite_name}</div>\n'
        sprites += '</div>'
    return sprites


def generate_code(version, source_file, tiles, lang_code):
    source_name = os.path.splitext(source_file)[0]
    code_header = language_data.get(lang_code, {}).get('headers', {}).get('Code', 'Code')
    codebox = ""
    codebox_content = ""

    # Loop over the tiles and generate a CodeSnip for each
    for tile_name, tile_info in tiles.items():
        if isinstance(tile_info, dict):
            codebox_content += "{{CodeSnip\n"
            codebox_content += "  | lang = json\n"
            codebox_content += "  | line = false\n"
            codebox_content += f"  | source = {source_name}\n"
            codebox_content += "  | path = ProjectZomboid\\media\\n"
            codebox_content += "  | retrieved = true\n"
            codebox_content += f"  | version = {version}\n"
            codebox_content += "  | code =\n"

            tile_json_str = json.dumps({tile_name: tile_info}, indent=4)
            code_lines = tile_json_str.split('\n')
            indented_code = '\n'.join('  ' + line for line in code_lines)
            codebox_content += indented_code + '\n'
            codebox_content += "}}\n"

    if codebox_content:
        codebox += f"=={code_header}==\n"
        codebox += "{{CodeBox|\n"
        codebox += codebox_content
        codebox += "}}"

    return codebox


# Function to compute the top 3 similar tiles for each tile
def compute_similar_tiles(tile_data, translations):
    processed_name_to_english_name = {}

    for processed_name in tile_data.keys():
        tile_name_en = extract_translation(translations.get('en', ''), processed_name)
        processed_name_to_english_name[processed_name] = tile_name_en

    tiles_list = list(processed_name_to_english_name.items())
    tile_similarities = {}

    # Computing tile similarities
    for i, (processed_name, tile_name) in tqdm.tqdm(enumerate(tiles_list), desc="Computing similarities",
                                                    total=len(tiles_list)):
        similarities = []
        for j, (other_processed_name, other_tile_name) in enumerate(tiles_list):
            if processed_name == other_processed_name:
                continue
            similarity = difflib.SequenceMatcher(None, tile_name.lower(), other_tile_name.lower()).ratio()
            similarities.append((other_processed_name, similarity))

        # Sort the similarities ang get the top 3
        sorted_similarities = sorted(similarities, key=lambda x: x[1], reverse=True)
        top3 = [t[0] for t in sorted_similarities[:3]]
        tile_similarities[processed_name] = top3

    return tile_similarities


def generate_see_also(top3_tiles):
    see_also_header = language_data.get('en', {}).get('headers', {}).get('see_also', 'See also')
    see_also = f"\n=={see_also_header}==\n"

    for tile_name in top3_tiles:
        item_name_en = extract_translation(translations.get('en', ''), tile_name)
        see_also += f"*{{{{ll|{item_name_en}}}}}\n"

    return see_also


def generate_footer():
    footer = "\n{{Navbox tiles}}"
    return footer


def assemble_article(lang_code, version, source_file, tiles, processed_name, definitions, top3_tiles):
    item_name = extract_translation(translations.get(lang_code, ''), processed_name)

    article_parts = [
        generate_header(lang_code, item_name),
        generate_infobox(processed_name, tiles, lang_code, definitions, version),
        generate_intro(lang_code, item_name),
        generate_usage(lang_code, tiles),
        generate_crafting(lang_code, tiles, definitions),
        # generate_sprites(lang_code, tiles),
        generate_code(version, source_file, tiles, lang_code),
        generate_see_also(top3_tiles),
        generate_footer()
    ]

    article_parts = [part for part in article_parts if part.strip()]
    return "\n".join(article_parts)


def article_generation():
    json_file = 'output/json/named_tiles.json'

    try:
        with open(json_file, 'r') as f:
            tile_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: {json_file} not found.")
        return
    except json.JSONDecodeError:
        print(f"Error: Failed to decode {json_file}.")
        return

    global translations
    translations = load_translation_files()

    global item_translations
    item_translations = load_item_translation()

    version = "41.78.16"
    source_file = 'newtiledefinitions.tiles.json'

    definitions = load_definitions()
    tile_similarities = compute_similar_tiles(tile_data, translations)

    # Initialize a set to track saved filenames
    saved_files = set()

    # Iterate over each tile group in the JSON data
    for processed_name, tiles in tile_data.items():
        # Extract translations for the tile group for each language
        for lang_code, translation_data in translations.items():
            # Check if the current lang_code exists in both LANGUAGE_CODES and language_data
            if lang_code in LANGUAGE_CODES and lang_code in language_data:
                # Output directory for articles
                articles_output_dir = os.path.join('output', lang_code, 'articles')
                if not os.path.exists(articles_output_dir):
                    os.makedirs(articles_output_dir)

                # Use the processed_name as the filename
                filename = processed_name.replace(" ", "_")
                article_file_path = os.path.join(articles_output_dir, f"{filename}.txt")
                saved_files.add(filename)

                # Get the top 3 similar tiles for the current tile
                top3_tiles = tile_similarities.get(processed_name, [])

                article_text = assemble_article(lang_code, version, source_file, tiles, processed_name, definitions, top3_tiles)
                with open(article_file_path, 'w', encoding='utf-8') as f:
                    f.write(article_text)

    print(f"Article generation completed. Number of articles generated: {len(saved_files)}")


def main():
    # Step 1: Cleanup
    cleanup_status = cleanup()
    print(f"Cleanup status: {cleanup_status}")

    # Step 2: Run the TileDefinitions.js script using Node.js
    js_file = 'TileDefinitions.js'

    try:
        print(f"Running {js_file} ...")
        subprocess.run(['node', js_file], check=True)
        print(f"JavaScript file {js_file} executed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error running {js_file}: {e}")
        return

    # Step 3: Processing and generation
    processing()


if __name__ == '__main__':
    translation_path = "resources/translations.csv"
    language_data = load_language_data(translation_path)
    main()
