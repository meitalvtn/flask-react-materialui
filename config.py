import os
import json


def config_read():
    if not os.path.exists('config.txt'):
        initial = {
            'base-commission': '0.05'
        }
        open('config.txt', 'w').write(json.dumps(initial))
    return json.load(open('config.txt'))


def config_add(config_name, value):
    configs = config_read()
    configs[config_name] = value
    with open('config.txt', 'w') as file:
        json.dump(configs, file)
