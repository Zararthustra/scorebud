import { Modal } from 'antd';

import { IconInfo } from '@assets/index';
import { Button } from '@components/index';

interface IModalReloadSWProps {
  needRefresh: boolean;
  offlineReady: boolean;
  close: () => void;
  updateServiceWorker: () => void;
}

const ModalReloadSW = ({
  needRefresh,
  offlineReady,
  close,
  updateServiceWorker
}: IModalReloadSWProps) => {
  return (
    <Modal
      centered
      open={needRefresh || offlineReady}
      width={400}
      closable={false}
      footer={
        <div className="flex-col gap-05 w-100">
          <Button
            onClick={updateServiceWorker}
            primary
            style={{ fontWeight: 600 }}>
            Mettre à jour
          </Button>
          <Button onClick={close}>Annuler</Button>
        </div>
      }>
      <div className="flex-col align-center">
        <h2>🎉 Nouvelle version 🎉</h2>

        <p className="mt-2 mb-0">Une nouvelle version est disponible !</p>

        <div className="tag--info br-full mt-2 flex gap-05 align-center justify-center">
          <IconInfo size={40} />
          <p className="f-s m-05">
            La mise à jour est recommandée pour éviter tout conflit, sauf si
            vous n'avez pas de connexion internet.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ModalReloadSW;
