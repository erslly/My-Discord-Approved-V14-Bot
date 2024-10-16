function loadCommands(client) {
    const ascii = require('ascii-table');
    const fs = require('fs');
    const table = new ascii().setHeading('Commands', 'Status');

    let commandsArray = [];

    const commandsFolder = fs.readdirSync('./Commands');
    for (const folder of commandsFolder) {
        const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            try {
                const commandFile = require(`../Commands/${folder}/${file}`);
                
                // Check if commandFile.data exists and has a name property
                if (commandFile.data && commandFile.data.name) {
                    const properties = { folder, ...commandFile };
                    client.commands.set(commandFile.data.name, properties);

                    commandsArray.push(commandFile.data.toJSON());

                    table.addRow(file, 'loaded');
                } else {
                    table.addRow(file, 'failed - missing data.name');
                }
            } catch (error) {
                table.addRow(file, `failed - ${error.message}`);
                console.error(`Error loading command ${file}:`, error);
            }
        }
    }

    client.application.commands.set(commandsArray)
        .then(() => console.log(table.toString(), '\nLoaded Commands'))
        .catch(console.error);
}

module.exports = { loadCommands };
