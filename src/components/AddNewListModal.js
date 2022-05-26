import {useState, useEffect} from 'react' 
import Modal from 'react-bootstrap/Modal'
import loadingIcon from '../assets/icon/loading.gif'
import { faSave, faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CONSTANTS from '../constants'
const base_url = CONSTANTS.CONFIG.BASE_URL;

const AddNewListModal = (props) => {
    const [loadingVisible, setLoadingVisible] = useState(false);

    const submitHandler = () => {
        setLoadingVisible(true);
        if(!props.editForm) processAdd();
        else processEdit();
    }

    const processAdd = () => {
        let currentDate = Math.round(new Date().getTime()/1000)
        
        const formData = new FormData();
        formData.append("list_desc", props.listDesc);
        formData.append("create_at", currentDate);

        fetch(base_url+'AitindoAPI/ListToDo/add_new_list',
        {
            method: 'POST',
            body: formData
        })
        .then((response) => response.json())
        .then((json) => {
            setLoadingVisible(false);
            console.log(json)
            if(json.response == 1){
                props.setLoadingVisible(true);
                props.setAlertStatus("success");
            }
            else{
                props.setAlertStatus("error");
            }
            props.setModalVisible(false);
            props.setShowAlert(true);
            props.setAlertMessage([json.title, json.msg]);
            props.setListDesc("");
        })
        .catch((error) => {
            setLoadingVisible(false);
            props.setModalVisible(false);
            props.setShowAlert(true);
            props.setAlertStatus("error");
            props.setAlertMessage(["Something's Wrong", error.toString()]);
            props.setListDesc("");
        });
    }

    const processEdit = () => {
        let currentDate = Math.round(new Date().getTime()/1000)

        const params = {
            id:props.toDoListId,
            list_desc:props.listDesc,
            update_at:currentDate
        }

        fetch(base_url+'AitindoAPI/ListToDo/update_list',
        {
            method: 'PUT',
            body: JSON.stringify(params)
        })
        .then((response) => response.json())
        .then((json) => {
            setLoadingVisible(false);
            console.log(json)
            if(json.response == 1){
                props.setLoadingVisible(true);
                props.setAlertStatus("success");
            }
            else{
                props.setAlertStatus("error");
            }
            props.setModalVisible(false);
            props.setShowAlert(true);
            props.setAlertMessage([json.title, json.msg]);
            props.setListDesc("");
        })
        .catch((error) => {
            setLoadingVisible(false);
            props.setModalVisible(false);
            props.setShowAlert(true);
            props.setAlertStatus("error");
            props.setAlertMessage(["Something's Wrong", error.toString()]);
            props.setListDesc("");
        });
    }

    return(
        <Modal 
            show={props.modalVisible}
            size="lg"
        >
            {!loadingVisible && (
                <Modal.Header>{props.modalTitle}</Modal.Header>
            )}

            <Modal.Body className="d-flex justify-content-center">
                {loadingVisible && (
                    <img src={loadingIcon} width="70%" />
                )}

                {!loadingVisible && (
                    <div className="col-12 mb-3">
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="5" placeholder='what do you want to do?' onInput={(event)=>props.setListDesc(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)) } value={props.listDesc} ></textarea>
                    </div>
                )}
            </Modal.Body>
            {!loadingVisible && (
            <Modal.Footer className="d-flex justify-content-between">
                <button type="button" className="btn btn-md btn-danger col-4 my-3" onClick={() => props.setModalVisible(false) }><FontAwesomeIcon icon={faClose}  /> Cancel</button>
                <button type="button" className="btn btn-md btn-success col-4 my-3" onClick={()=> submitHandler()}><FontAwesomeIcon icon={faSave}  /> Save</button>
            </Modal.Footer>
            )}
        </Modal>
    )
}

export default AddNewListModal;