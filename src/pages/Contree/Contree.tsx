import { Switch } from 'antd';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  IconClub,
  IconDiamond,
  IconError,
  IconHeart,
  IconReset,
  IconSpade
} from '@assets/index';
import { clearLS } from '@services/localStorageService';
import { Button, ModalAddPlayers } from '@components/index';
import AppContext, { IAppContext } from '@services/AppContext';

import './Contree.scss';

interface IContree {
  bid: string;
  trump: 'diamond' | 'spade' | 'heart' | 'club' | '';
  contract: string;
}

const Contree = () => {
  const navigate = useNavigate();
  const { players } = useContext<IAppContext>(AppContext);
  const [contre, setContre] = useState<boolean>(false);
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
  const onSubmitHandler = async (values: IContree) => {
    console.log(values);
  };

  const { values, errors, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      bid: '',
      trump: '',
      contract: ''
    },
    onSubmit: onSubmitHandler,
    validationSchema: object({
      bid: string().required("Sélectionnez l'équipe qui a enchéri"),
      trump: string().required("Sélectionnez l'atout"),
      contract: string().required('Sélectionnez la valeur du contrat')
    })
  });

  console.log('errors =>', errors);
  console.log('values =>', values);

  if (players.length !== 2)
    return (
      <>
        <ModalAddPlayers
          showModal={showAddPlayersModal}
          setShowModal={setShowAddPlayersModal}
        />

        <div className="Contree pb-5 px-1">
          <h1 className="mt-5">La Belote Contrée</h1>
          <div className="flex align-center gap-1 tag--red">
            <IconError />
            <p className="m-0">
              Le tableau des scores doit comprendre
              <strong> exactement 2 colonnes </strong>
              correspondantes aux 2 équipes.
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
      <div className="Contree pb-5 px-1">
        <h1 className="mt-5">La Belote Contrée</h1>
        <form
          className="flex-col align-start w-100 gap-1"
          onSubmit={handleSubmit}>
          {/* Bid */}
          <div className="w-100">
            <div className="flex align-center justify-between gap-1">
              <h2>Enchères</h2>
              {errors.bid && <p className="m-0 tag tag--red">{errors.bid}</p>}
            </div>
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
                    (values.bid === team.name ? 'toggle-button--selected' : '')
                  }>
                  {team.name}
                </div>
              ))}
            </div>
          </div>

          {/* Trump */}
          <div className="w-100">
            <div className="flex align-center justify-between gap-1">
              <h2>Atout</h2>
              {errors.trump && (
                <p className="m-0 tag tag--red">{errors.trump}</p>
              )}
            </div>
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
                  <trump.icon width={20} height={20} />
                </div>
              ))}
            </div>
          </div>

          {/* Contract */}
          <div className="w-100">
            <div className="flex align-center justify-between gap-1">
              <h2>Contrat</h2>
              {errors.contract && (
                <p className="m-0 tag tag--red">{errors.contract}</p>
              )}
            </div>
            <select
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

          {/* Contré */}
          <div className="w-100">
            <div className="flex align-center justify-between gap-1">
              <h2>Contré ?</h2>
              {errors.contract && (
                <p className="m-0 tag tag--red">{errors.contract}</p>
              )}
            </div>
            Switch here
            {/* <Switch onChange={() => {
                setFieldValue('contre', contre);
                navigator.vibrate(50);
            })} /> */}
          </div>

          <Button
            primary
            type="submit"
            disabled={!!Object.values(errors).length}
            className="my-3 self-center">
            Commencer le calcul
          </Button>
        </form>
      </div>
    </>
  );
};
export default Contree;
