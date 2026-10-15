const readline = require("readline");
const sql = require("mssql");
require("dotenv").config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    server: process.env.DB_SERVER,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

sql.connect(config)
    .then(() => {
        console.log("✅ Connected to SQL Server");
        showMenu();
    })
    .catch(err => {
        console.error("❌ Connection Failed:", err);
        process.exit(1);
    });

function showMenu() {
    console.log(`
========= Library Menu =========
1) Insert
2) Select
3) Update
4) Delete
5) Exit
================================
`);
    rl.question("Select Program ", handleMenu);
}

async function handleMenu(choice) {
    switch (choice.trim()) {
        case "1":
            rl.question("Name Book: ", (title) => {
                rl.question("How many: ", async (qty) => {
                    try {
                        await sql.query`INSERT INTO Books (Title, Quantity) VALUES (${title}, ${parseInt(qty)})`;
                        console.log("✅Succeed");
                    } catch (err) {
                        console.error("❌ Error:", err.message);
                    }
                    showMenu();
                });
            });
            break;

        case "2":
            try {
                const result = await sql.query`SELECT * FROM Books`;
                console.table(result.recordset);
            } catch (err) {
                console.error("❌ Error:", err.message);
            }
            showMenu();
            break;

        case "3":
            rl.question("BookID To Fix: ", (id) => {
                rl.question("choose ( 1.title / 2.quantity ): ", (field) => {
                    rl.question("Fix to: ", async (value) => {
                        try {
                            if (field === "1") {
                                await sql.query`UPDATE Books SET Title=${value} WHERE BookID=${parseInt(id)}`;
                                console.log("✅ Completely fixed");
                            } else if (field === "2") {
                                await sql.query`UPDATE Books SET Quantity=${parseInt(value)} WHERE BookID=${parseInt(id)}`;
                                console.log("✅ Completely fixed");
                            } else {
                                console.log("❌❌Incorrect choice❌❌");
                            }

                        } catch (err) {
                            console.error("❌❌Error:", err.message);
                        }
                        showMenu();
                    });
                });
            });
            break;

        case "4":
            rl.question("BookID To Delete: ", async (id) => {
                try {
                    await sql.query`DELETE FROM Books WHERE BookID=${parseInt(id)}`;
                    console.log("✅ Successfully deleted");
                } catch (err) {
                    console.error("❌ Error:", err.message);
                }
                showMenu();
            });
            break;

        case "5":
            console.log("💀💀💀 END PROGRAM 💀💀💀");
            rl.close();
            process.exit(0);
            break;

        default:
            console.log("⚠️⚠️ Only (1-5) ⚠️⚠️");
            showMenu();
    }
}