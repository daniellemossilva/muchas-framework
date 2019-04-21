import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

export = (configYamlPath: string = path.join(process.cwd(), 'muchas.yml')): {} => {
    try {
        // Checks if the config file exists
        if (!fs.existsSync(configYamlPath)) {
            throw new Error(`Config file not found at ${configYamlPath}`);
        }

        // Read the file
        let yamlFileString = fs.readFileSync(configYamlPath, 'utf8')

        // Get the environments ( ${ENV} ) variables
        const yamlEnvironments = yamlFileString.match(/\${([^}]+)}/igm);

        // Loop and try to replace for the env variable before loading to the process.env
        yamlEnvironments.forEach((env: string): void => {
            const cleanEnv = env.replace(/\$|{|}/igm, '');
            yamlFileString = yamlFileString.replace(new RegExp('\\${' + cleanEnv + '}', 'igm'), process.env[cleanEnv] || null);
        });

        // Loads the yaml string to a object
        const yamlObject = yaml.safeLoad(yamlFileString);

        // Merge the loaded string to the process env and overrides any conflicted variable
        return process.env = { ...yamlObject, ...process.env };
    } catch (error) {
        throw new Error(error);
    }
};
