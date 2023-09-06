interface ITableHeader {}

const TableHeader = ({}: ITableHeader) => {
  return (
    <div className="ScoreTable__header">
      <p>Nombre de joueurs</p>
      <p>Noms des joueurs</p>
      <p>Ajouter une manche</p>
    </div>
  );
};
export default TableHeader;
