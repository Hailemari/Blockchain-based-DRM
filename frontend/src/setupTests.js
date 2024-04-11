import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'node-fetch/lib/fetch-npm-global.js';


configure({ adapter: new Adapter() });

