import * as z from "zod";
import { DtoField } from "@components/generic-components";
import {
  DynamicValues,
  ValidationResult,
} from "@components/generic-components/edit-components/common";

const getValidator = (fields: DtoField[]) => {
  const shape: any = {};

  for (const field of fields) {
    let shapeItem;

    switch (field.type) {
      case "string":
        if (field.nullable) shapeItem = z.nullable(z.string());
        else shapeItem = z.string();

        if (typeof field.minLength !== "undefined") {
          shapeItem = z.string().min(field.minLength);
        }

        if (typeof field.maxLength !== "undefined") {
          shapeItem = z.string().max(field.maxLength);
        }

        if (field.pattern) {
          shapeItem = z
            .string()
            .regex(RegExp(field.pattern), `Doesn't match regexp "${field.pattern}"`);
        }

        shape[field.name] = field.required ? shapeItem : shapeItem.optional();
        break;

      case "number":
        shapeItem = z.number();

        shape[field.name] = shapeItem;

        shape[field.name] = field.required ? shapeItem : shapeItem.optional();
        break;

      case "integer":
        shapeItem = z.number().int();

        shape[field.name] = field.required ? shapeItem : shapeItem.optional();
        break;

      default:
        break;
    }
  }

  return z.object(shape);
};

export const validate = (fields: DtoField[], values: DynamicValues): ValidationResult => {
  const res: ValidationResult = {};

  const validator = getValidator(fields);

  try {
    validator.parse(values);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.errors = {};
      for (const issue of error.issues) {
        if (res.errors[issue.path[0]]) {
          res.errors[issue.path[0]] += `, ${issue.message}`;
        } else {
          res.errors[issue.path[0]] = issue.message;
        }
      }
    }
  }

  return res;
};
