import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ListItem as ListItemType } from '@reactive-resume/schema';
import clsx from 'clsx';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import { useTranslation } from 'next-i18next';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteItem, setResumeState } from '@/store/resume/resumeSlice';

import styles from './List.module.scss';
import ListItem from './ListItem';

type Props = {
  path: string;
  titleKey?: string;
  subtitleKey?: string;
  onEdit?: (item: ListItemType) => void;
  onDuplicate?: (item: ListItemType) => void;
  className?: string;
};

const List: React.FC<Props> = ({
  path,
  titleKey = 'title',
  subtitleKey = 'subtitle',
  onEdit,
  onDuplicate,
  className,
}) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const list: ListItemType[] = useAppSelector((state) => get(state.resume.present, path, []));

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(PointerSensor));

  const handleEdit = (item: ListItemType) => {
    isFunction(onEdit) && onEdit(item);
  };

  const handleDuplicate = (item: ListItemType) => {
    isFunction(onDuplicate) && onDuplicate(item);
  };

  const handleDelete = (item: ListItemType) => {
    dispatch(deleteItem({ path, value: item }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = list.findIndex((item) => item.id === active.id);
      const newIndex = list.findIndex((item) => item.id === over.id);
      const newList = arrayMove(list, oldIndex, newIndex);

      dispatch(setResumeState({ path, value: newList }));
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <div className={clsx(styles.container, className)}>
        {isEmpty(list) && <div className={styles.empty}>{t<string>('builder.common.list.empty-text')}</div>}

        <SortableContext items={list} strategy={verticalListSortingStrategy}>
          {list.map((item, index) => {
            const title = get(item, titleKey, '');
            const subtitleObj = get(item, subtitleKey);
            const subtitle: string = isArray(subtitleObj) ? subtitleObj.join(', ') : subtitleObj;

            return (
              <ListItem
                key={item.id}
                path={path}
                item={item}
                index={index}
                title={title}
                subtitle={subtitle}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            );
          })}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default List;
