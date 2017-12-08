import 'babel-polyfill'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })
const testsContext = require.context('./', true, /\.spec\.js$/)
testsContext.keys().forEach(key => testsContext(key))
