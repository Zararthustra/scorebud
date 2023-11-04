import { Link } from 'react-router-dom';
import './Rules.scss';

const Rules = () => (
  <div className="Rules">
    <h1 className="my-5">Règles</h1>
    <div className="flex-col gap-1">
      <Link
        target="_blank"
        rel="noopener noreferrer"
        to="https://cdn.1j1ju.com/medias/0b/1c/6d-living-forest-regle.pdf">
        Living Forest
      </Link>
      <Link
        target="_blank"
        rel="noopener noreferrer"
        to="https://www.data.ludonaute.fr/Living_Forest_Kodama/Rules/FR_LivingForestKodama_Rules.pdf">
        Living Forest Kodama
      </Link>
    </div>
  </div>
);
export default Rules;
