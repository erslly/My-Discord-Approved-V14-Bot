const ascii = require('ascii-table');
const fs = require('fs');

function loadEvents(client) {
    const table = new ascii().setHeading('Events', 'Status');

    // Load all event folders
    const folders = fs.readdirSync('./Events');
    for (const folder of folders) {
        // Load all event files in the folder
        const files = fs.readdirSync(`./Events/${folder}`).filter(file => file.endsWith('.js'));

        for (const file of files) {
            try {
                // Load the event file
                const event = require(`../Events/${folder}/${file}`);

                // Check if event object contains `name` and `execute` properties
                if (!event.name || typeof event.execute !== 'function') {
                    table.addRow(file, 'Failed - Missing `name` or `execute`');
                    continue;
                }

                // Register the event
                if (event.rest) {
                    // If event is a REST event
                    if (event.once) {
                        client.rest.once(event.name, (...args) => event.execute(...args, client));
                    } else {
                        client.rest.on(event.name, (...args) => event.execute(...args, client));
                    }
                } else {
                    // If event is a WebSocket event
                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(...args, client));
                    } else {
                        client.on(event.name, (...args) => event.execute(...args, client));
                    }
                }

                table.addRow(file, 'Loaded');
            } catch (error) {
                table.addRow(file, `Failed - ${error.message}`);
            }
        }
    }

    console.log(table.toString(), '\nLoaded events');
}

module.exports = { loadEvents };
