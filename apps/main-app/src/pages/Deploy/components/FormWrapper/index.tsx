import React from "react";
import { Form } from "@yisa/webui";
import { FormProps } from "@yisa/webui/es/Form";
import { FormItemConfig } from "./interface";
import classnames from "classnames";
type FormWrapperProps<T> = FormProps & {
  form: T;
  formItems: FormItemConfig<T>[];
  validateFields?: string[];
};
function FormWrapper<T>(props: FormWrapperProps<T>) {
  const { form, formItems, validateFields = [], ...formProps } = props;
  return (
    <Form colon={false} {...formProps}>
      {formItems
        .filter((item) => {
          return item.show ?? true;
        })
        .map((item, index) => {
          if (item.wrapped) {
            return (
              <React.Fragment key={item.key ?? index}>
                {item.element}
              </React.Fragment>
            );
          }
          return (
            <Form.Item
              className={classnames(item.className)}
              key={item.key}
              label={item.label}
              required={item.required}
              errorMessage={
                validateFields.includes(item.name as string)
                  ? item.validate?.(form)
                  : ""
              }
            >
              {item.element}
            </Form.Item>
          );
        })}
    </Form>
  );
}

export default FormWrapper;
