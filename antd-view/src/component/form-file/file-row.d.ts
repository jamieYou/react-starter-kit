import { FormRowProps } from 'react-helper/ant-form/form-row'

export default class FileRow  {
  props: FormRowProps & {
    multiple?: boolean
    width?: number
    height?: number
  }
}
