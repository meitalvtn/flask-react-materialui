import os
import json


def config_read():
    if not os.path.exists('config.json'):
        initial = {
            'base-commission': 0.05
        }
        open('config.json', 'w').write(json.dumps(initial))
    return json.load(open('config.json'))


def config_add(config_name, value):
    configs = config_read()
    configs[config_name] = value
    with open('config.json', 'w') as file:
        json.dump(configs, file)
