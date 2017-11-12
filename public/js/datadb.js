

function insertProject(pname, pdescription, sop, calcdeadline ) {

    db.run(`INSERT INTO Project (ProjectName, ProjectDescription, StartofProduction)
            VALUES(?)`, [pname, pdescription, sop, calcdeadline], function(err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
}


