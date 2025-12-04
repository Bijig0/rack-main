import api from "../../services/api";
import endPoints from "../../services/endpoints";
import { showToastAction } from "../slices/commonSlice";

export const getPricaLabEstimatorDataAction = (setIsLoading, onRes) => async (dispatch) => {
    setIsLoading(true)
    try {
        const res = await api("get", endPoints.ESTIMATOR_PROPERTY);
        if (res?.data) {
            onRes?.(res.data);
        }
    } catch (error) {
        console.error("Estimator property fetch error:", error);
        dispatch(showToastAction({
            type: "error",
            title: error?.message || "Error fetching estimator property",
            detail: "An unexpected error occurred. Please try again later."
        }));
    }
};

export const getPropertyDataByIdAction = (propertyId,setIsLoading, onRes) => async (dispatch) => {
    setIsLoading(true)
    try {
        const res = await api("get", endPoints.ESTIMATOR_PROPERTY_BY_ID(propertyId));
        if (res?.data) {
            onRes?.(res.data);
        }
    } catch (error) {
        console.error("Estimator property fetch error:", error);
        dispatch(showToastAction({
            type: "error",
            title: error?.message || "Error fetching estimator property",
            detail: "An unexpected error occurred. Please try again later."
        }));
    }
};