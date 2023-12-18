import { styled } from "@mui/material";

export const ContentListContainer = styled("div")``;

export const ContentEditContainer = styled("div")`
  flex-grow: 1;
`;

export const ContentDeleteContainer = styled("div")`
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

export const ContentItemContainer = styled("div")`
  padding: 0 5%;
`;

export const TagsContainer = styled("div")`
  display: flex;
  flex-flow: row;
  gap: ${({ theme }) => theme.spacing(2)};
  font-size: 80%;
`;

export const AuthorContainer = styled("div")`
  font-size: 80%;
`;
export const DescriptionContainer = styled("div")`
  font-size: 80%;
`;

export const TitleContainer = styled("div")`
  font-size: 32px;
  font-weight: 500;
  width: 100%;
`;

export const TimestampContainer = styled("div")`
  font-size: 80%;
`;

export const CoverImage = styled("img")`
  width: 40%;
`;

export const HeaderContainer = styled("div")`
  display: flex;
  flex-flow: row;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const CommentsContainer = styled("div")`
  margin: 10px 0;
`;

export const CommentsTitle = styled("div")`
  font-weight: 500;
`;

export const CommentContainer = styled("div")`
  margin: 10px;
`;

export const CommentDateContainer = styled("span")`
  font-size: 80%;
`;

export const ContentListWrapper = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f0;
`;

export const DummyDiv = styled("div")`
  width: 100%;
  height: 100%;
  background-color: #f4f5f7;
`;
