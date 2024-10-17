import re
import json
import os

def split_args(args_str):
    args = []
    current_arg = ''
    nesting = 0
    i = 0
    while i < len(args_str):
        c = args_str[i]
        if c == '{':
            nesting +=1
            current_arg += c
        elif c == '}':
            nesting -=1
            current_arg += c
        elif c == ',' and nesting == 0:
            args.append(current_arg.strip())
            current_arg = ''
        else:
            current_arg += c
        i +=1
    if current_arg.strip():
        args.append(current_arg.strip())
    return args

def parse_arg(arg_str):
    arg_str = arg_str.strip()
    if arg_str.startswith('"') and arg_str.endswith('"'):
        # String
        return arg_str[1:-1]
    elif arg_str.startswith('{') and arg_str.endswith('}'):
        # Table
        content = arg_str[1:-1].strip()
        elements = split_args(content)
        return [parse_arg(elem) for elem in elements]
    elif arg_str == 'true':
        return True
    elif arg_str == 'false':
        return False
    else:
        # Could be number or enumeration
        try:
            if '.' in arg_str:
                return float(arg_str)
            else:
                return int(arg_str)
        except ValueError:
            # Treat as string (e.g., enumeration)
            return arg_str

def main():
    input_file = 'resources/ISMoveableDefinitions.lua'
    output_file = 'output/json/movabledefinitions.json'

    # Create output directory if it doesn't exist
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    lines = []
    with open(input_file, 'r') as f:
        for line in f:
            line = line.strip()
            if line.startswith('--') or line == '':
                continue
            lines.append(line)

    function_names = ['addToolDefinition', 'addMaterialDefinition', 'addScrapDefinition', 'addScrapItem']
    function_patterns = {}
    for fname in function_names:
        pattern = re.compile(r'moveableDefinitions\.' + fname + r'\s*\(')
        function_patterns[fname] = pattern

    tool_definitions = {}
    material_definitions = {}
    scrap_definitions = {}
    scrap_items = []

    function_params = {
        'addToolDefinition': ['_name', '_items', '_perk', '_baseActionTime', '_sound', '_isWav'],
        'addMaterialDefinition': ['_material', '_returnItem', '_maxAmount', '_chancePerRoll'],
        'addScrapDefinition': ['_material', '_tools', '_tools2', '_perk', '_baseActionTime', '_sound', '_isWav', '_baseChance', '_unusableItem'],
        'addScrapItem': ['_material', '_returnItem', '_maxAmount', '_chancePerRoll', '_isStaticSize']
    }

    i = 0
    while i < len(lines):
        line = lines[i]
        matched = False
        for fname, pattern in function_patterns.items():
            if pattern.search(line):
                # Found a function call
                func_lines = [line]
                open_parens = line.count('(') - line.count(')')
                i += 1
                while open_parens > 0 and i < len(lines):
                    line = lines[i]
                    func_lines.append(line)
                    open_parens += line.count('(') - line.count(')')
                    i += 1
                # Now we have the function call in func_lines
                func_str = ' '.join(func_lines)
                # Remove the function call prefix
                args_str = re.sub(r'.*' + fname + r'\s*\(', '', func_str)
                # Remove the trailing closing parenthesis and semicolon
                args_str = args_str.rsplit(')', 1)[0]
                # Split the arguments
                args_list = split_args(args_str)
                # Parse each argument
                parsed_args = [parse_arg(arg) for arg in args_list]
                # Map to parameter names
                params = function_params[fname]
                arg_dict = dict(zip(params, parsed_args))
                # Store the definition
                if fname == 'addToolDefinition':
                    key = arg_dict['_name']
                    tool_definitions[key] = arg_dict
                elif fname == 'addMaterialDefinition':
                    key = arg_dict['_material']
                    if key not in material_definitions:
                        material_definitions[key] = []
                    material_definitions[key].append({
                        'returnItem': arg_dict['_returnItem'],
                        'maxAmount': arg_dict['_maxAmount'],
                        'chancePerRoll': arg_dict['_chancePerRoll']
                    })
                elif fname == 'addScrapDefinition':
                    key = arg_dict['_material']
                    scrap_definitions[key] = arg_dict
                elif fname == 'addScrapItem':
                    scrap_items.append(arg_dict)
                matched = True
                break
        if not matched:
            i += 1

    # Now, write the data to JSON
    definitions = {
        'tool_definitions': tool_definitions,
        'material_definitions': material_definitions,
        'scrap_definitions': scrap_definitions,
        'scrap_items': scrap_items
    }

    with open(output_file, 'w') as f:
        json.dump(definitions, f, indent=4)
        status = "Definitions parsed successfully."
        print(status)
    return

if __name__ == '__main__':
    main()
