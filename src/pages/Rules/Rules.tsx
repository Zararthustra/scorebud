import { Link } from 'react-router-dom';
import { rules } from '@data/index';

import './Rules.scss';

const Rules = () => (
  <div className="Rules">
    <h1 className="my-5">Règles</h1>
    <div className="flex-col gap-1">
      {rules.map((rule, index) => (
        <Link
          key={index}
          target="_blank"
          rel="noopener noreferrer"
          to={rule.url}>
          {rule.name}
        </Link>
      ))}
    </div>
  </div>
);
export default Rules;
