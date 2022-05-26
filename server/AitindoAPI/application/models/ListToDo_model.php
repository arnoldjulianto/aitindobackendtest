<?php
class ListToDo_model extends CI_Model {
	function get_new_id(){
		$this->db->select('id',FALSE);
		$this->db->order_by('id','DESC');
		$this->db->limit(1);  		  
		$query = $this->db->get('todo_list');   		
		if($query->num_rows() <> 0){   
			$data = $query->row();
			$kode = intval($data->id) + 1;       
		}
		else{    
    		$kode = 1;     
		}
		$jumlah_karakter = strlen($kode);
		$kodemax = str_pad($kode, $jumlah_karakter, "0", STR_PAD_LEFT);    
		$kodejadi = $kodemax;     
		return $kodejadi;   
	}

    function getAllTodoList(){
        $this->db->select("*");
        $this->db->from("todo_list");
        $this->db->where("delete_at", "");
        $this->db->order_by("id", "DESC");
        return $this->db->get()->result_array();
    }
}