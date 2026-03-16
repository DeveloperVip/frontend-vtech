'use client';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading,
  Link,
  BlockQuote,
  List,
  Indent,
  IndentBlock,
  Alignment,
  Image,
  ImageUpload,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageResize,
  Base64UploadAdapter,
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
  HorizontalLine,
  CodeBlock,
  RemoveFormat,
  FontColor,
  FontBackgroundColor,
  FontSize,
  FontFamily,
  Autoformat,
  AutoLink,
  MediaEmbed,
  SourceEditing,
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CKEditorField({ value, onChange, placeholder }: Props) {
  return (
    <div className="ckeditor-wrapper">
      <CKEditor
        editor={ClassicEditor}
        config={{
          licenseKey: 'GPL',
          plugins: [
            Essentials,
            Autoformat,
            AutoLink,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Heading,
            Paragraph,
            Link,
            BlockQuote,
            List,
            Indent,
            IndentBlock,
            Alignment,
            Image,
            ImageUpload,
            ImageCaption,
            ImageStyle,
            ImageToolbar,
            ImageResize,
            Base64UploadAdapter,
            Table,
            TableToolbar,
            TableProperties,
            TableCellProperties,
            HorizontalLine,
            CodeBlock,
            RemoveFormat,
            FontColor,
            FontBackgroundColor,
            FontSize,
            FontFamily,
            MediaEmbed,
            SourceEditing,
          ],
          toolbar: {
            items: [
              'heading',
              '|',
              'fontSize',
              'fontFamily',
              'fontColor',
              'fontBackgroundColor',
              '|',
              'bold',
              'italic',
              'underline',
              'strikethrough',
              'removeFormat',
              '|',
              'alignment',
              '|',
              'bulletedList',
              'numberedList',
              'indent',
              'outdent',
              '|',
              'link',
              'blockQuote',
              'insertTable',
              'mediaEmbed',
              'horizontalLine',
              'codeBlock',
              '|',
              'uploadImage',
              '|',
              'undo',
              'redo',
              '|',
              'sourceEditing',
            ],
            shouldNotGroupWhenFull: true,
          },
          heading: {
            options: [
              { model: 'paragraph', title: 'Đoạn văn', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Tiêu đề 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Tiêu đề 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Tiêu đề 3', class: 'ck-heading_heading3' },
              { model: 'heading4', view: 'h4', title: 'Tiêu đề 4', class: 'ck-heading_heading4' },
            ],
          },
          image: {
            toolbar: [
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side',
              '|',
              'toggleImageCaption',
              'imageTextAlternative',
              '|',
              'resizeImage',
            ],
          },
          table: {
            contentToolbar: [
              'tableColumn',
              'tableRow',
              'mergeTableCells',
              'tableProperties',
              'tableCellProperties',
            ],
          },
          placeholder: placeholder || 'Nhập nội dung bài viết...',
        }}
        data={value}
        onChange={(_event, editor) => {
          onChange(editor.getData());
        }}
      />
    </div>
  );
}
