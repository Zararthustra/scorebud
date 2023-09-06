interface ITableFooter {}

const TableFooter = ({}: ITableFooter) => {
  return (
    <div className="ScoreTable__footer">
      <p>Total</p>
      <p>Classement</p>
    </div>
  );
};
export default TableFooter;
