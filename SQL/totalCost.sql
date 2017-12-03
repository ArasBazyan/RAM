SELECT 'Total kostnad', Sum (Cost) FROM PersonNodeResource WHERE idNode IN(
WITH RECURSIVE affectedNodes AS (
SELECT idNode from Node WHERE Node.idProject=1 UNION ALL
SELECT Node.idParentNode FROM Node WHERE Node.idNode = Node.idParentNode AND Node.idParentNode IS NOT NULL)
SELECT * FROM affectedNodes)
