CREATE TABLE Node (
	idNode integer PRIMARY KEY,
	idProject integer NOT NULL REFERENCES Project(idProject),
	idParentNode integer REFERENCES Node(idNode),
	idResponsible integer NOT NULL REFERENCES Person(idPerson),
	idBackupResponsible integer NOT NULL REFERENCES Person(idPerson),
	idNodeType integer NOT NULL REFERENCES NodeType(idNodeType),
	NodeDescription string,
	Cost integer,
	idCostType integer REFERENCES CostType(idCostType),
	dateStart date,
	dateEnd date,
	Version integer,
	Completed boolean,
	Archived boolean,
	Comments string
);

CREATE TABLE Project (
	idProject integer PRIMARY KEY ,
	ProjectName string,
	ProjectDescription string,
	Version integer,
	VersionLocked boolean,
	idManager integer NOT NULL REFERENCES Person(idPerson),
	dateStart date,
	dateEnd date,
	StartofProduction date,
	Archived boolean,
	ProjectComments string
);

CREATE TABLE Person (
	idPerson integer PRIMARY KEY ,
	FirstName string,
	LastName string,
	idRoleType integer REFERENCES RoleType(idRoleType),
	idOrganization integer REFERENCES Organization(idOrganization)
);

CREATE TABLE NodeType (
	idNodeType integer PRIMARY KEY ,
	NodeTypeName string,
	NodeTypeDescription string
);

CREATE TABLE CostType (
	idCostType integer PRIMARY KEY ,
	CostType string
);

CREATE TABLE PersonNodeResource (
	idActivity integer PRIMARY KEY ,
	idNode integer NOT NULL REFERENCES Node(idNode),
	idResource integer REFERENCES Resources(idResource),
	idPerson integer REFERENCES Person(idPerson),
	ActivityDescription string,
	Cost integer,
	idCostType integer REFERENCES Project(idCostType),
	dateStart date,
	dateEnd date,
	Comments string
);

CREATE TABLE Resources (
	idResource integer PRIMARY KEY ,
	idResourceType integer NOT NULL REFERENCES ResourceType(idResourceType),
	ResourceName string,
	ResourceDescription string
);

CREATE TABLE ResourceType (
	idResourceType integer PRIMARY KEY ,
	ResourceType string
);

CREATE TABLE Documents (
	idDocuments integer PRIMARY KEY ,
	idProject integer NOT NULL REFERENCES Project(idProject),
	DocumentName string,
	DocumentData blob,
	DocumentDescription string,
	DocumentType integer NOT NULL REFERENCES DocumentType(idDocumentType),
	DocumentDate datetime
);

CREATE TABLE DocumentType (
	idDocumentType integer PRIMARY KEY ,
	DocumentType string
);

CREATE TABLE RoleType (
	idRoleType integer PRIMARY KEY ,
	RoleType string
);

CREATE TABLE Organization (
	idOrganization integer PRIMARY KEY ,
	OrganizationName string,
	idParentOrganization integer REFERENCES Organization(idOrganization)
);