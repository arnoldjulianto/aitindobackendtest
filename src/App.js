import './App.css';
import AddNewListModal from './components/AddNewListModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faSync, faEdit } from '@fortawesome/free-solid-svg-icons'
import {useEffect, useState, useCallback} from 'react' 
import loadingIcon from './assets/icon/loading.gif'
import swal from 'sweetalert'
import CONSTANTS from './constants'
import moment from 'moment'
import Moment from 'react-moment'
import 'moment-timezone'

const base_url = CONSTANTS.CONFIG.BASE_URL;

function App() {
  let checkAllLabel = "Mark All As Done";
  const [toDoList, setToDoList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false)
  const [loadingVisible, setLoadingVisible] = useState(true);
  const [showAlert, setShowAlert] = useState(false)
  const [editForm, setEditForm] = useState(false)
  const [alertMessage, setAlertMessage] = useState([])
  const [alertStatus, setAlertStatus] = useState("")
  const [alertButtons, setAlertButtons] = useState({
    default: "Close",
  })
  const [checkedAll, setCheckedAll] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState([]);
  const [toDoListId, setToDoListId] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [listDesc, setListDesc] = useState("");

  useEffect(()=> {
    if(loadingVisible){
      loadToDoList();
    }
  },[loadingVisible])

  useEffect(()=>{
    if(showAlert){
        swal({
          title: alertMessage[0],
          text: alertMessage[1],
          icon: alertStatus,
            buttons: alertButtons,
          },
        ).then((value) => {
          switch (value) {
            case "accept":
              setShowAlert(false);
              setAlertButtons({
                default: "Close",
              })
              acceptTask()
              swal.startLoading()
              break;

            case "danger":
              setShowAlert(false);
              setAlertButtons({
                default: "Close",
              })
              break;

            default:
              setShowAlert(false);
              setAlertButtons({
                default: "Close",
              })
              break; 
          }
        })
    }
  },[showAlert])


  useEffect(() => {
    if(progress.length == toDoList.length ){
      setCompleted(true)
    }
  },[progress])

  useEffect(() => {
      if(completed){
        loadToDoList();
      }
  },[completed])

  useEffect(() => { 
      if(toDoList.length > 0){
        const cek = cekJumlahChecked();
        if(cek) setCheckedAll(true);
        else setCheckedAll(false);
      }
  },[toDoList])

  const loadToDoList = () => {
      fetch(base_url+'AitindoAPI/ListToDo/get_all_todo_list',
      {
          method: 'GET'
      })
      .then((response) => response.json())
      .then((json) => {
          setLoadingVisible(false);
          console.log(json)
          let data = [];
          json.todo_list.forEach((item, index)=>{
              data[index] = {
                id : item.id,
                list_desc : item.list_desc,
                status : item.status,
                create_at : item.create_at,
                update_at : item.update_at,
                delete_at : item.delete_at,
                showLoading : false
              }
          })
          setToDoList(data);
      })
      .catch((error) => {
          setLoadingVisible(false);
      });
  }

  const handleCheckAll = (e) => {
      let data = [...toDoList];
      setCompleted(false);
      setProgress([]);
      if(e.target.checked){
          data.forEach((item, idx) => {
            if(item.status == "0") handleUpdate(item.id, item.list_desc, "0", idx)
            else {
              let prog = [];
              prog = progress;
              prog.push("");
              setProgress(prevState => ([...prevState, prog]))
            }
          })
      }
      else{
          data.forEach((item, idx) => {
            if(item.status == "1")  handleUpdate(item.id, item.list_desc, "1", idx)
            else {
              let prog = [];
              prog = progress;
              prog.push("");
              setProgress(prevState => ([...prevState, prog]))
            }
          })
      }
  }

  const handleUpdate = (id, list_desc, status, index, e) => {
    let currentDate = Math.round(new Date().getTime()/1000)

    setCompleted(false)
    let data = [...toDoList];
    data.forEach((item, idx)=>{
        if(index == idx){
          item.showLoading = true;
        }
    })
    setToDoList(data);
    const changeStatus =  status == "0" ? "1" : "0";

    const params = {
        id,
        status:changeStatus,
        list_desc,
        update_at:currentDate
    }
    
    fetch(base_url+'AitindoAPI/ListToDo/update_list',
      {
          method: 'PUT',
          body: JSON.stringify(params)
      })
      .then((response) => response.json())
      .then((json) => {
        let prog = []
        if(json.response == 1){
            if(!e){
              prog = progress;
              prog.push("");
              setProgress(prevState => ([...prevState, prog]))
            }
            else{
              setCompleted(true)
            }
        }
      })
      .catch((error) => {
          let data = [...toDoList];
          data.forEach((item, idx)=>{
              if(index == idx){
                console.log("INDEX ERROR", idx)
                item.showLoading = false;
              }
          })
          setToDoList(data);
          setShowAlert(true);
          setAlertStatus("error");
          setAlertMessage(["Something's Wrong", error.toString()]);
      });
  } 

  const cekJumlahChecked = () =>{
    let x = true;
    for (var i = 0; i < toDoList.length; i++){
        if(toDoList[i].status == '0') {
            x = false;
            break;
        }
    }
    return x;
  }

  const acceptTask = () => {
    let currentDate = Math.round(new Date().getTime()/1000)

    const params = {
        id:toDoListId,
        delete_at:currentDate,
    }
    fetch(base_url+'AitindoAPI/ListToDo/delete_list',
    {
        method: 'DELETE',
        body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((json) => {
      if(json.response == 1){
          setShowAlert(true);
          setAlertStatus("success");
          setAlertMessage([json.title, json.msg]);
          setLoadingVisible(true);
      }
    })
    .catch((error) => {
        setShowAlert(true);
        setAlertStatus("error");
        setAlertMessage(["Something's Wrong", error.toString()]);
        loadToDoList();
    });
  }

  function timeConverter(UNIX_timestamp){
      var a = new Date(UNIX_timestamp * 1000);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = a.getFullYear();
      var month = months[a.getMonth()+1];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      var time = (date < 10 ? "0" + date : date) + ' ' + (month < 10 ? "0" + month : month) + ' ' + year + ' ' + (month < 10 ? "0" + hour : hour) + ':' + (min < 10 ? "0" + min : min);
      return time;
  }

  return (
    <div className="container">
      <div className="row">
          <AddNewListModal modalVisible={modalVisible} setModalVisible={setModalVisible} modalTitle={modalTitle} setModalTitle={setModalTitle} setShowAlert={setShowAlert} setAlertMessage={setAlertMessage} setAlertStatus={setAlertStatus} setLoadingVisible={setLoadingVisible} listDesc={listDesc} setListDesc={setListDesc} editForm={editForm}  toDoListId={toDoListId} />
          
          <div className="col-md-2"></div>

          <div className="card col-md-8 bg-light text-black mt-2" >
            <div className="card-header">
              <h2 className="card-title text-center">To Do List</h2>
            </div>  
            
            <div className="card-body">
                <div className="data-wrapper mb-3">
                  <table className="table table-borderless text-center">
                    <thead >
                        <tr>
                            <th>No.</th>
                            <th>List Desc</th>
                            <th>
                              {!loadingVisible && toDoList.length > 0  && (
                                <div>
                                  <div className="form-group">
                                    <label className="form-check-label form-label" onClick={() => {handleCheckAll()} } >
                                    {checkAllLabel}</label>
                                  </div>
                                
                                  <input className="form-check-input border border-primary"  type="checkbox" value="" id="checkAll" onClick={(e) => {
                                     handleCheckAll(e)
                                  }} checked={checkedAll}  />
                                </div>  
                              )}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody >
                      {!loadingVisible && toDoList.length == 0 && (
                        <tr>
                          <td colSpan="4">
                              <div className={"alert  alert-dismissible fade show text-center"} role="alert">
                              <strong>No Data Found</strong> 
                            </div>
                          </td>
                        </tr>
                      )}

                      {loadingVisible && (
                        <tr>
                          <td colSpan="4">
                            <div className="d-flex justify-content-center">
                              <img src={loadingIcon} width="30%" className="text-center" />
                            </div>
                          </td>
                        </tr>    
                      )}

                      {!loadingVisible && toDoList.map((item,index) => (
                        <tr className="todo-list-item">
                          <td>{index+1}</td>
                          <td className="list-desc">
                              <div className="card-text "  >
                                {item.list_desc}
                                <div className="card-text list-date"  >last update {timeConverter(item.update_at)}</div>
                              </div>
                          </td>
                          <td  >
                            <div className="form-group">
                              {!item.showLoading && (  
                                <input className="form-check-input border border-primary"  type="checkbox"  onChange={(e) => handleUpdate(item.id, item.list_desc, item.status, index, e) } checked={item.status == "1" ? true : false } value={item.status == "1" ? "0" : "1" }
                                />
                              )}

                              {item.showLoading && (  
                                <img src={loadingIcon} width="50" height="50" className="rounded-circle" />
                              )}
                            </div>
                          </td>
                          
                          <td className="table-action">
                            <button type="button" className="btn btn-dark btn-sm" onClick={()=> {
                                  setToDoListId(item.id)
                                  setEditForm(true)
                                  setListDesc(item.list_desc)
                                  setModalTitle("Edit To Do List")
                                  setModalVisible(true)
                              }} >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <span className="mx-2">|</span>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => {
                                setAlertButtons({accept:"Yes, I'm sure", danger:"No, cancel"})
                                setShowAlert(true)
                                setAlertStatus("warning")
                                setAlertMessage(["Are you sure you want to delete the current item?", "Once you delete it, you can't see this item again"])
                                setToDoListId(item.id)
                            }}>
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>

            <div className="card-footer d-flex justify-content-between">
                <button type="button" className="btn btn-sm btn-primary my-3 col-4" onClick={()=> setLoadingVisible(true)} ><FontAwesomeIcon icon={faSync}  /> Refresh</button>

                <button type="button" className="btn btn-sm btn-success my-3 col-4" onClick={()=> {
                    setEditForm(false)
                    setModalTitle("New To Do List")
                    setModalVisible(true)
                  }}><FontAwesomeIcon icon={faPlus}  /> Add New</button>
            </div>
          </div>

          <div className="col-md-2"></div>
      </div>     
    </div>     
  );
}

export default App;
