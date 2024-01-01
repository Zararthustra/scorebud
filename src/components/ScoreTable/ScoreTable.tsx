import { useState } from 'react';

import { IPlayer } from '@interfaces/index';
import { ModalAddTurn } from '@components/index';

import './ScoreTable.scss';

interface IScoreTable {
  players: IPlayer[];
}

const ScoreTable = ({ players }: IScoreTable) => {
  const [showModalAddTurn, setShowModalAddTurn] = useState<boolean>(false);

  const bestPlayerTurn = (turn: number) => {
    const turnScores = players.map((player) => player.scores[turn]);
    const bestScore = Math.max(...turnScores);
    const bestPlayers = players.filter(
      (player) => player.scores[turn] === bestScore
    );
    if (bestPlayers.length === players.length || bestPlayers.length === 0)
      return null;

    return bestPlayers.map((player) => player.name);
  };

  return (
    <>
      <ModalAddTurn
        showModal={showModalAddTurn}
        setShowModal={setShowModalAddTurn}
      />
      <div className="ScoreTable">
        <table>
          <thead>
            <tr>
              <th
                onClick={() => setShowModalAddTurn(true)}
                style={{ cursor: 'pointer' }}>
                +
              </th>
              {players.map((turn, index) => (
                <th key={index} className="ScoreTable__column">
                  {turn.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.length > 0 &&
              players[0].scores.map((score, turnIndex) => (
                <tr key={turnIndex}>
                  <td className="ScoreTable__turn-column">{turnIndex + 1}</td>
                  {players.map((player, index) => (
                    <td key={index} className="ScoreTable__column">
                      <p
                        className={
                          bestPlayerTurn(turnIndex)?.includes(player.name)
                            ? 'ScoreTable__best-player'
                            : 'm-0'
                        }>
                        {player.scores[turnIndex]}
                      </p>
                    </td>
                  ))}
                </tr>
              ))}
            <tr>
              <td
                className="ScoreTable__turn-column"
                style={{ borderTop: '1px solid white' }}>
                Tot
              </td>
              {players.map((player, index) => (
                <td key={index} className="ScoreTable__total-column">
                  {player.scores.reduce((a, b) => a + b, 0)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
export default ScoreTable;
