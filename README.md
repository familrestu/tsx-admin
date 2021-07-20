# Description
Admin Template Apps

# How to use
To add page, go to /src/screens
Make sure to add menu object in redux with this format

``` typescript
type UserMenuDetailType = {
    menu_id: string;
    menu_name: string;
    group_name: string | null;
    icon: string | null;
    url: string;
    pagepath: string | null;
    access_only: 0 | 1;
    accessmode: 0 | 1 | 2 | 3 | 'read' | 'write' | 'update' | 'delete';
    children?: UserMenuDetailType[];
};
```
