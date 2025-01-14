import {
  IconBriefcase,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },
  {
    id: uniqueId(),
    title: "Case List",
    icon: IconBriefcase,
    href: "/case",
  },
];

export default Menuitems;
