import { WrappedFormUtils } from 'antd/lib/form/Form'
import { FormRowProps } from 'react-helper/ant-form/form-row'

export default class DateRow {
  props: FormRowProps & {
    form: WrappedFormUtils,
    id: string | string[],
  }
}
