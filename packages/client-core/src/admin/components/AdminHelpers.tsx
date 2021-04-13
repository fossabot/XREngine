import React from 'react';

import {
    TableHead,
    TableRow,
    TableCell,
    TableSortLabel
} from '@material-ui/core';

// @ts-ignore
import styles from './Admin.module.scss';

type Order = 'asc' | 'desc';
interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property) => void;
    order: Order;
    orderBy: string;
    headCells?: any[];
}
export function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort, headCells } = props;
    const createSortHandler = (property) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead className={styles.thead}>
            <TableRow className={styles.trow}>
                {headCells.map((headCell) => (
                    <TableCell
                        className={styles.tcell}
                        key={headCell.id}
                        align='center'
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}