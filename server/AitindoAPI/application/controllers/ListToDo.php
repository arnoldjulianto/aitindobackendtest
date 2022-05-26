<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ListToDo extends CI_Controller { 
	
	function __construct(){
		parent::__construct();
		$this->load->model('ListToDo_model');
	}

	function get_all_todo_list(){
		$data = [
			'response' => 1,
			'todo_list' => $this->ListToDo_model->getAllTodoList()
		];
		echo json_encode($data);
	}

	function add_new_list(){
		$list_desc = $this->input->post("list_desc");
		if(str_replace(" ","", $list_desc) <> "" ){
				$create_at = $this->input->post("create_at");
				$id = $this->ListToDo_model->get_new_id();
				$params = [
					'id' => $id,
					'list_desc' => $list_desc,
					'status' => '0',
					'create_at' => $create_at,
					'update_at' => $create_at,
				];

				$this->db->insert("todo_list",$params);
				$cek  = $this->db->get_where("todo_list",array("id" => $id ))->row_array();
				if(ISSET($cek)) {
					$data = [
						'response' => 1,
						'title' => "Added Successfully",
						'msg' => "You can set the status of the new list to be done if you want it"
					];
				}
				else{
					$data = [
						'response' => 0,
						'title' => "Failed To Add",
						'msg' => "Something happened and the data failed to save"
					];
				}
		}
		else{
			$data = [
				'response' => 0,
				'title' => "Failed To Add",
				'msg' => "Please Fill The New To Do List Description"
			];
		}
		
		echo json_encode($data);
	}

	function update_list(){
		$status = $update_at = "";
		$json = file_get_contents('php://input');
		$put = json_decode($json, true);
		$old_data = $this->db->get_where("todo_list", array("id" => $put['id'] ))->row_array();
		if(!ISSET($put['status'])) $status = $old_data['status'];
		else $status = $put['status'];
		$params = [
			'list_desc' => $put['list_desc'],	
			'status' => $status,	
			'update_at' => $put['update_at'],	
		];
		$this->db->where("id",$put['id']);
		$this->db->update("todo_list",$params);
		$data = [
			'response' => 1,
			'title' => 'Updated Successfully',
			'msg' => ''
		];
		echo json_encode($data);
	}

	function delete_list(){
		$json = file_get_contents('php://input');
		$delete = json_decode($json, true);
		$params = [	
			'delete_at' => $delete['delete_at'],	
		];
		$this->db->where("id",$delete['id']);
		$this->db->update("todo_list",$params);
		$data = [
			'response' => 1,
			'title' => 'Deleted Succesfully'
		];
		echo json_encode($data);
	}

}