import React, { Component, Fragment } from 'react'
import { Input } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import { FormRow, formConsumer } from 'react-helper/ant-form'

@formConsumer
export default class DateRow extends Component {
  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.string, PropTypes.array
    ]).isRequired
  }

  componentDidMount() {
    if (this.useRange) {
      const { form } = this.props
      form.setFieldsValue({
        [this.range_field]: [form.getFieldValue(this.gt_field), form.getFieldValue(this.lt_field)].map(v => v && moment(v))
      })
    }
  }

  onChange = ([gt, lt]) => {
    this.props.form.setFieldsValue({
      [this.gt_field]: this.getSubmitFormat(gt, 'gt'),
      [this.lt_field]: this.getSubmitFormat(lt, 'lt'),
    })
  }

  options = {
    getValueFromEvent: date => this.getSubmitFormat(date),
    getValueProps: v => ({ value: v && moment(v) })
  }

  getSubmitFormat(date, type) {
    return do {
      if (date) {
        if (this.props.children.props.showTime) date.toJSON()
        else {
          const options = do {
            if (type === 'gt') ({ hour: 0, minute: 0, second: 0 })
            else if (type === 'lt') ({ hour: 23, minute: 59, second: 59 })
          }
          if (options) date.set(options).toJSON()
          else date.format('YYYY-MM-DD')
        }
      } else {
        ''
      }
    }
  }

  get useRange() {
    return typeof this.props.id !== 'string'
  }

  get range_field() {
    return this.props.id.join('_and_').replace(/\./g, '_')
  }

  get gt_field() {
    return this.props.id[0]
  }

  get lt_field() {
    return this.props.id[1]
  }

  render() {
    const { children, required, id, ...props } = this.props
    if (this.useRange) {
      return (
        <Fragment>
          <FormRow id={this.range_field} rule={{ type: 'array' }} required={required} {...props}>
            {React.cloneElement(children, { onChange: this.onChange })}
          </FormRow>
          <FormRow id={this.gt_field} style={{ display: 'none' }} required={required}>
            <Input/>
          </FormRow>
          <FormRow id={this.lt_field} style={{ display: 'none' }} required={required}>
            <Input/>
          </FormRow>
        </Fragment>
      )
    } else {
      return (
        <FormRow id={id} options={this.options} required={required} {...props}>
          {children}
        </FormRow>
      )
    }
  }
}
