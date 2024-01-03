import { Switch } from 'antd';
import { useFormik } from 'formik';
import { useContext, useState } from 'react';
import { boolean, object, string } from 'yup';
import { useNavigate } from 'react-router-dom';

import {
  IconClub,
  IconDiamond,
  IconError,
  IconHeart,
  IconReset,
  IconSpade
} from '@assets/index';
import { ISetupContree } from '@interfaces/index';
import { Button, ModalAddPlayers } from '@components/index';
import { clearLS, setLS } from '@services/localStorageService';
import AppContext, { IAppContext } from '@services/AppContext';

import './Setup.scss';

interface ISetupProps {
  setSetup: (value: string) => void;
}

const Setup = ({ setSetup }: ISetupProps) => {
  const navigate = useNavigate();
  const { players } = useContext<IAppContext>(AppContext);
  const [contre, setContre] = useState<boolean>(false);
  const [rebelote, setRebelote] = useState<boolean>(false);
  const [showAddPlayersModal, setShowAddPlayersModal] =
    useState<boolean>(false);
  const trumps = [
    {
      name: 'club',
      icon: IconClub
    },
    {
      name: 'heart',
      icon: IconHeart
    },
    {
      name: 'spade',
      icon: IconSpade
    },
    {
      name: 'diamond',
      icon: IconDiamond
    }
  ];
  const contracts = [
    '80',
    '90',
    '100',
    '110',
    '120',
    '130',
    '140',
    '150',
    '160',
    'capot'
  ];

  const handleReset = () => {
    clearLS();
    navigate(0);
  };
  const onSubmitHandler = async (values: ISetupContree) => {
    setLS('contree', JSON.stringify(values));
    setSetup(JSON.stringify(values));
  };

  const { values, errors, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      bid: '',
      trump: '',
      contract: '',
      contre: false,
      rebelote: false,
      rebeloteTeam: '',
      lastPli: ''
    },
    onSubmit: onSubmitHandler,
    validationSchema: object({
      bid: string().required("Sélectionnez l'équipe qui a enchéri"),
      trump: string().required("Sélectionnez l'atout"),
      contract: string().required('Sélectionnez la valeur du contrat'),
      contre: boolean(),
      rebelote: boolean(),
      rebeloteTeam: string().when('rebelote', {
        is: true,
        then: (schema) => schema.required("Sélectionnez l'équipe")
      }),
      lastPli: string().required(
        "Sélectionnez l'équipe qui remporte le dernier pli"
      )
    })
  });

  if (players.length !== 2)
    return (
      <>
        <ModalAddPlayers
          showModal={showAddPlayersModal}
          setShowModal={setShowAddPlayersModal}
        />

        <div className="Setup pb-5 px-1">
          <div className="flex align-center gap-1 tag--red">
            <IconError />
            <p className="m-0">
              Vous devez avoir
              <strong> 2 équipes </strong>et vous avez actuellement{' '}
              <strong>
                {players.length + (players.length > 1 ? ' équipes' : ' équipe')}
              </strong>
              .
            </p>
          </div>
          {players.length === 0 ? (
            <Button
              onClick={() => setShowAddPlayersModal(true)}
              primary
              className="my-2"
              style={{ fontWeight: 600 }}>
              Ajouter les équipes
            </Button>
          ) : (
            <Button
              onClick={handleReset}
              primary
              className="my-2"
              style={{ fontWeight: 600 }}>
              <IconReset size={30} />
              Reset
            </Button>
          )}
        </div>
      </>
    );
  return (
    <>
      <div className="Setup">
        <form
          className="flex-col align-start w-100 gap-1"
          onSubmit={handleSubmit}>
          {/* Bid */}
          <div className="w-100">
            <div className="flex align-center justify-between gap-1">
              <h2>Enchères</h2>
              <div className="flex toggle-buttons">
                {players.map((team, index) => (
                  <div
                    onClick={() => {
                      setFieldValue('bid', team.name);
                      navigator.vibrate(50);
                    }}
                    key={index}
                    className={
                      'toggle-button ' +
                      (values.bid === team.name
                        ? 'toggle-button--selected'
                        : '')
                    }>
                    {team.name}
                  </div>
                ))}
              </div>
            </div>
            {errors.bid && <p className="m-0 tag tag--red">{errors.bid}</p>}
          </div>

          {/* Trump */}
          <div className="w-100">
            <div className="flex align-center justify-between gap-1">
              <h2>Atout</h2>
              <div className="flex toggle-buttons">
                {trumps.map((trump, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setFieldValue('trump', trump.name);
                      navigator.vibrate(50);
                    }}
                    className={
                      'toggle-button flex align-center ' +
                      (values.trump === trump.name
                        ? 'toggle-button--selected'
                        : '')
                    }>
                    <trump.icon width={16} height={16} />
                  </div>
                ))}
              </div>
            </div>
            {errors.trump && <p className="m-0 tag tag--red">{errors.trump}</p>}
          </div>

          {/* Contract */}
          <div className="w-100">
            <div className="flex align-center justify-between gap-1">
              <h2>Contrat</h2>
              <select
                id="contract"
                className="select"
                onChange={(e) => {
                  setFieldValue('contract', e.target.value);
                  navigator.vibrate(50);
                }}>
                <option value="">Sélectionnez une valeur</option>
                {contracts.map((amount, index) => (
                  <option key={index} value={amount}>
                    {amount}
                  </option>
                ))}
              </select>
            </div>
            {errors.contract && (
              <p className="m-0 tag tag--red">{errors.contract}</p>
            )}
          </div>

          {/* Rebelote */}
          <div className="w-100 flex-col">
            <div className="flex align-center justify-between gap-1 w-100">
              <h2>Belote/Rebelote</h2>
              <Switch
                onChange={() => {
                  setFieldValue('rebelote', !rebelote);
                  setRebelote(!rebelote);
                  navigator.vibrate(50);
                }}
              />
            </div>
            {rebelote && errors.rebeloteTeam && (
              <p className="mb-05 tag tag--red">{errors.rebeloteTeam}</p>
            )}
            {rebelote && (
              <div className="flex self-ends toggle-buttons">
                {players.map((team, index) => (
                  <div
                    onClick={() => {
                      setFieldValue('rebeloteTeam', team.name);
                      navigator.vibrate(50);
                    }}
                    key={index}
                    className={
                      'toggle-button ' +
                      (values.rebeloteTeam === team.name
                        ? 'toggle-button--selected'
                        : '')
                    }>
                    {team.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contré */}
          <div className="flex align-center justify-between gap-1 w-100">
            <h2>Contré</h2>
            <Switch
              onChange={() => {
                setFieldValue('contre', !contre);
                setContre(!contre);
                navigator.vibrate(50);
              }}
            />
          </div>

          {/* Last pli */}
          <div className="w-100">
            <div className="flex align-center justify-between gap-1">
              <h2>Dernier pli</h2>
              <div className="flex toggle-buttons">
                {players.map((team, index) => (
                  <div
                    onClick={() => {
                      setFieldValue('lastPli', team.name);
                      navigator.vibrate(50);
                    }}
                    key={index}
                    className={
                      'toggle-button ' +
                      (values.lastPli === team.name
                        ? 'toggle-button--selected'
                        : '')
                    }>
                    {team.name}
                  </div>
                ))}
              </div>
            </div>
            {errors.lastPli && (
              <p className="m-0 tag tag--red">{errors.lastPli}</p>
            )}
          </div>

          <div className="flex-col self-center gap-05 w-100 mt-3">
            <Button
              primary
              type="submit"
              onClick={() => setLS('calculate', players[0].name)}
              disabled={!!Object.values(errors).length}>
              Calculer {players[0].name}
            </Button>
            <Button
              primary
              onClick={() => setLS('calculate', players[1].name)}
              type="submit"
              disabled={!!Object.values(errors).length}>
              Calculer {players[1].name}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
export default Setup;
