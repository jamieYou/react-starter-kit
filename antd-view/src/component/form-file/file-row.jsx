import React, { Component } from 'react'
import _ from 'lodash'
import toast from 'react-helper/ant-toast'
import { FormRow } from 'react-helper/ant-form'
import { qiniuMeta } from '@store'
import { autoBind } from '@utils'

export default class FileRow extends Component {
  static defaultProps = {
    multiple: true,
  }

  fileList = null

  @autoBind
  getValueFromEvent({ fileList, file }) {
    if (file.status === 'done') {
      const currentFile = _.find(fileList, { uid: file.uid })
      currentFile.url = `${location.protocol}//${qiniuMeta.bucket_domain}/${file.response.key}`
      fileList = this.props.multiple ? fileList : [currentFile]
    }

    else if (file.status === 'error') {
      toast.error('上传失败')
      _.remove(fileList, item => item.uid === file.uid)
    }

    this.fileList = fileList
    const images = fileList.map(v => v.url || v.status)
    return this.props.multiple ? images : images[0]
  }

  @autoBind
  getValueProps(value) {
    const fileList = this.fileList || _.map([].concat(value).filter(Boolean), (url, index) => {
      return {
        url,
        uid: `files-${index}`,
        status: 'done',
        thumbUrl: url,
        name: getFileName(url),
      }
    })
    return { fileList }
  }

  get size_limit() {
    const { width, height } = this.props
    return width || height ? `尺寸需要为${width || '任意'}x${height || '任意'}` : void 0
  }

  @autoBind
  beforeUpload(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onerror = reject
      reader.onload = () => {
        const img = new Image()
        img.src = reader.result
        img.onerror = reject
        img.onload = () => {
          const { width = img.width, height = img.height } = this.props
          if (_.toNumber(width) === img.width && _.toNumber(height) === img.height) resolve()
          else {
            const error = new Error(`尺寸 ${img.width}x${img.height} 不符合要求`)
            toast.error(error.message)
            reject(error)
          }
        }
      }
    })
  }

  render() {
    const { id, children, multiple, extra, options, ...props } = this.props
    const rule = { type: multiple ? 'array' : 'string' }
    const extra_msg = [this.size_limit, extra].filter(Boolean).join('，')
    return (
      <FormRow
        id={id}
        rule={rule}
        extra={extra_msg}
        {...props}
        options={Object.assign(_.pick(this, 'getValueFromEvent', 'getValueProps'), options)}
      >
        {React.cloneElement(children, { beforeUpload: this.size_limit && this.beforeUpload })}
      </FormRow>
    )
  }
}

function getFileName(url) {
  const a = document.createElement('a')
  a.href = url
  return a.pathname.split('/').pop()
}
