import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DeleteOutline, DriveFileRenameOutline, FileCopy, MoreVert } from '@mui/icons-material';
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';
import { ListItem as ListItemType } from '@reactive-resume/schema';
import clsx from 'clsx';
import isFunction from 'lodash/isFunction';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';

import styles from './ListItem.module.scss';

type Props = {
  item: ListItemType;
  path: string;
  index: number;
  title: string;
  subtitle?: string;
  onEdit?: (item: ListItemType) => void;
  onDelete?: (item: ListItemType) => void;
  onDuplicate?: (item: ListItemType) => void;
};

const ListItem: React.FC<Props> = ({ item, path, index, title, subtitle, onEdit, onDelete, onDuplicate }) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id! });

  const itemStyle: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition };

  const handleOpen = (event: React.MouseEvent<Element>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (item: ListItemType) => {
    isFunction(onEdit) && onEdit(item);
    handleClose();
  };

  const handleDelete = (item: ListItemType) => {
    isFunction(onDelete) && onDelete(item);
    handleClose();
  };

  const handleDuplicate = (item: ListItemType) => {
    isFunction(onDuplicate) && onDuplicate(item);
    handleClose();
  };

  return (
    <div ref={setNodeRef} className={clsx(styles.item)} style={itemStyle} {...attributes} {...listeners}>
      <div className={styles.meta}>
        <h1 className={styles.title}>{title}</h1>
        <h2 className={styles.subtitle}>{subtitle}</h2>
      </div>

      <div>
        <IconButton onClick={handleOpen}>
          <MoreVert />
        </IconButton>

        <Menu anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)}>
          <MenuItem onClick={() => handleEdit(item)}>
            <ListItemIcon>
              <DriveFileRenameOutline className="scale-90" />
            </ListItemIcon>
            <ListItemText>{t<string>('builder.common.list.actions.edit')}</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => handleDuplicate(item)}>
            <ListItemIcon>
              <FileCopy className="scale-90" />
            </ListItemIcon>
            <ListItemText>{t<string>('builder.common.list.actions.duplicate')}</ListItemText>
          </MenuItem>

          <Divider />

          <Tooltip arrow placement="right" title={t<string>('builder.common.tooltip.delete-item')}>
            <div>
              <MenuItem onClick={() => handleDelete(item)}>
                <ListItemIcon>
                  <DeleteOutline className="scale-90" />
                </ListItemIcon>
                <ListItemText>{t<string>('builder.common.list.actions.delete')}</ListItemText>
              </MenuItem>
            </div>
          </Tooltip>
        </Menu>
      </div>
    </div>
  );
};

export default ListItem;
