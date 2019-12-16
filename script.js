
/**
 * LearnSQL Database
 */
let database = {
    Cats: {
        columns: {
            Name: {
                type: 'string',
                nullable: false
            },
            Birth: {
                type: 'number',
                nullable: false
            },
            Alive: {
                type: 'boolean',
                nullable: true
            },
            Color: {
                type: 'string',
                nullable: true
            }
        },
        items: [
            [ 'Bella',       2013, true, 'Tabby' ],
            [ 'Satan',       2012, true, 'Black' ]
        ]
    },
    Dogs: {
        columns: {
            Name: {
                type: 'string',
                nullable: false
            },
            Birth: {
                type: 'number',
                nullable: false
            },
            Alive: {
                type: 'boolean',
                nullable: true
            },
            Kind: {
                type: 'string',
                nullable: true
            }
        },
        items: [
            [ 'ラテちゃん',    2013, true, 'Labrador' ],
            [ 'Eleina\'s Doggo', 2017, true, 'Big Boye' ]
        ]
    },
    People: {
        columns: {
            Name: {
                type: 'string',
                nullable: false
            },
            LuckyNumber: {
                type: 'number',
                nullable: false
            },
            Nationality: {
                type: 'string',
                nullable: true
            },
            Education: {
                type: 'string',
                nullable: true
            }
        },
        items: [
            [ 'Raresh', 420, 'Romanian', 'University' ],
            [ 'Vlad', 7, 'Romanian', 'High School' ],
            [ 'Vaibhav', 7, 'néo-zélandais', 'University' ],
        ]
    }
}

let sql = undefined
let db = undefined

// set up the database now, in parallel with the webpage
initSqlJs().then(SQL => {
    sql = SQL
    db = new SQL.Database()

    // insert demo data
    let demoQuery = 'CREATE TABLE Cats (Name TEXT, Birth INTEGER, Alive INTEGER, Color TEXT);'
    demoQuery += 'INSERT INTO Cats VALUES ("Bella", 2013, 1, "Tabby");'
    demoQuery += 'INSERT INTO Cats VALUES ("Garfield", 1976, 1, "Tabby");'
    demoQuery += 'INSERT INTO Cats VALUES ("Tom", 1940, 1, "Tuxedo");'
    db.run(demoQuery)

    // update the database view
    updateDatabaseView(db.exec('SELECT * FROM Cats'))
})

document.addEventListener('DOMContentLoaded', () => {
    console.log('content ready')

    /* database update field */

    let viewSelector = document.getElementById('database-view-selector')
    viewSelector.addEventListener('mouseover', ev => {
        let selectedTable = viewSelector.value 

        // clear options
        while (viewSelector.firstChild)
            viewSelector.removeChild(viewSelector.firstChild)

        // add new ones
        getTables().forEach(val => {
            let option = document.createElement('option')
            option.value = val
            option.innerText = val
            if (val === selectedTable)
                option.selected = true
            viewSelector.appendChild(option)
        })
    })
    viewSelector.addEventListener('change', (ev) => {
        let tableName = ev.currentTarget.value
        updateDatabaseView(db.exec('SELECT * FROM ' + tableName))
    })

    /* query handling */

    let queryForm = document.getElementById("query-form")
    queryForm.addEventListener('submit', ev => {
        ev.preventDefault()
        try {
            let response = db.exec(queryForm.query.value)
            if (response.length <= 0) {
                showQueryError('Query executed successfully')
                return
            }
            updateQueryResponse(response)
        } catch (error) {
            showQueryError(error)
        }
    })
})

/**
 * returns a list of the tables in database
 */
function getTables ()
{
    let sqlResult = db.exec('SELECT name FROM sqlite_master WHERE type="table";')[0]
    return sqlResult.values.map(val => val[0])
}

/*! showing tables */

/**
 * Generic function for replace the HTML table (target) with data (table)
 * @param {HTMLTableElement} target
 * @param {object} result 
 */
function updateTableView (target, result)
{
    if (typeof result != 'object') {
        throw `Table isn't valid.`
    }

    // SQLite's result is an array, ours as just an object
    // adjust
    result = result[0]

    let thead = target.querySelector("thead tr")
    let tbody = target.querySelector("tbody")

    // empty out head and body of the table
    while (thead.firstChild) thead.removeChild(thead.firstChild)
    while (tbody.firstChild) tbody.removeChild(tbody.firstChild)

    // go through each columns
    result.columns.forEach(val => {
        let th = document.createElement('th')
        th.innerText = val
        thead.append(th)
    })

    // add the items
    result.values.forEach(val => {
        let tr = document.createElement('tr')
        // index ?

        val.forEach(val => {
            let td = document.createElement('td')
            td.innerText = val || 'null'
            if (typeof val == 'number') {
                td.style.textAlign = 'right'
                td.style.fontVariantNumeric = 'tabular-nums'
            }
            tr.append(td)
        })

        tbody.append(tr)
    })
}

/**
 * Updates the database view with the attached table
 * @param {object} table Table data
 */
function updateDatabaseView (table)
{
    updateTableView(document.getElementById('database-view-table'), table)
}

/**
 * Updates the query response with the attached pseudo-table
 * @param {object} table Result data
 */
function updateQueryResponse (table)
{
    updateTableView(document.getElementById('query-response-table'), table)

    document.getElementById('query-error').style.display = 'none'
    document.getElementById('query-response').style.display = 'block'
}

function showQueryError (error)
{
    let errorP = document.getElementById('query-error').querySelector('p')
    errorP.innerText = error
    
    document.getElementById('query-error').style.display = 'block'
    document.getElementById('query-response').style.display = 'none'
}
