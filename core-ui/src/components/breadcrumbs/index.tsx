import { NavigateNext } from "@mui/icons-material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { GhostLink } from "components/ghost-link";

interface Links {
  linkText: string;
  toRoute: string;
}

interface BreadCrumbProps {
  links: Links[];
  current: string;
}

export const BreadCrumbNavigation = ({ links, current }: BreadCrumbProps) => {
  return (
    <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
      {links.map((link, index) => (
        <Link key={index} to={link.toRoute} component={GhostLink} underline="hover">
          {link.linkText}
        </Link>
      ))}
      <Typography variant="body1">{current}</Typography>
    </Breadcrumbs>
  );
};
