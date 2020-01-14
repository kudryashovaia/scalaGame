import React from 'react';
import _ from "lodash";
import {MenuItem, NavDropdown} from 'react-bootstrap';


interface MenuDescription {
  title: string;
  link?: string;
  items?: MenuDescription[];
}

function buildMenu(menus: MenuDescription[]): React.ReactNode[] {
  let items: React.ReactNode[] = [];
  menus.forEach(menu => {
    if (menu.items) {
      let menuItems = buildMenu(menu.items);
      items.push(menuItems);
    } else {
      if (menu.link) {
        items.push(
            <MenuItem
                className={"dropdown-item dropdown-toggle"}
                key={menu.title}
                href={"/#" + menu.link}
            >
              {menu.title}
            </MenuItem>
        );
      }
    }
  });
  return items;
}

interface MenuGroupProps {
  groupTitle: string;
  menus: MenuDescription[];
}


export const MenuGroup: React.SFC<MenuGroupProps> = props => {
  let menu = buildMenu(props.menus);
  return (
      <NavDropdown title={props.groupTitle} id={"nav-dropdown-" + props.groupTitle.replace(" ", "_")}>
        {menu}
      </NavDropdown>
  );
};
