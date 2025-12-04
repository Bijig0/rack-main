import React, { useEffect, useState } from 'react'
import PrivateLayout from '../../layout/Private'
import TitleContainer from '../../shared/components/TitleContainer'
import { getPricaLabEstimatorDataAction } from '../../store/actions/propertyAction';
import { useDispatch } from 'react-redux';
import TableContainer from '../../shared/components/TableContainer';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useNavigate } from 'react-router-dom';

const PropertyList = () => {
    const [list, setList] = useState([]);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const fetchPropertyList = () => {
        dispatch(getPricaLabEstimatorDataAction(setIsLoading, (res) => {
            setList(res);
            setIsLoading(false)
        }));
    };

    useEffect(() => {
        fetchPropertyList();
    }, []);

    const handleViewClick = (rowData) => {
        navigate(`/pricelab-estimator/${rowData._id}`, { state: rowData })
    }

    const columns = [
        {
            name: "Address",
            accessor: "address",
            sortable: true,
            body: (rowData) => rowData?.address,
        },
        {
            name: "Category",
            accessor: "category",
            sortable: true,
            body: (rowData) => rowData?.category,
        },
    ];

    const actionTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-text p-button-sm"
                    onClick={() => handleViewClick(rowData)}
                />
            </div>
        );
    };

    if (isLoading) {
        return (
            <PrivateLayout>
                <div className="flex justify-center align-items-center h-[51.7vh] ">
                    <ProgressSpinner />
                </div>
            </PrivateLayout>
        );
    }



    return (
        <PrivateLayout>
            <div className="">
                {/* Header */}
                <TitleContainer title={"Property Details"} />
            </div>

            <TableContainer
                list={list}
                columns={columns}
                selectionMode="none"
                actions={actionTemplate}
                ActionTemplate="Actions"
                tableClass="property-table"
            />

        </PrivateLayout>
    )
}

export default PropertyList
