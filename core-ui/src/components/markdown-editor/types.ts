import { RequestContextType } from "@providers/request-provider";
import { ContentDetails } from "@features/blog/content-edit/types";
import { ICommand, ICommandBase } from "@uiw/react-md-editor";
import { ValidateFrontmatterError } from "utils/frontmatter-validator";

type textChangeFunc = (value: string | undefined) => void;

export type onFrontmatterErrorChangeFunc = (error: ValidateFrontmatterError | null) => void;

export interface ExtendedCommandBase<T> extends ICommandBase<T> {
  contentDetails: ContentDetails;
  networkContext: RequestContextType;
}

export interface CommandContext {
  networkContext: RequestContextType;
  contentDetails: ContentDetails;
}

export interface MarkdownEditorProps {
  value: string;
  onChange: textChangeFunc;
  isReadOnly: boolean | undefined;
  contentDetails: ContentDetails;
  onFrontmatterErrorChange: onFrontmatterErrorChangeFunc;
}

export interface ImageUploadingContext {
  currentFile: File;
  contentDetails: ContentDetails;
}
