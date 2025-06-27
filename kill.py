import requests
from requests.auth import HTTPBasicAuth

class CamundaProcessKiller:
    def __init__(self, camunda_url, username, password):
        self.camunda_url = camunda_url.rstrip('/')
        self.auth = HTTPBasicAuth(username, password)
        
    def get_running_process_instances(self, process_definition_key=None):
        """Get list of running process instances"""
        url = f"{self.camunda_url}/engine-rest/process-instance"
        params = {}
        if process_definition_key:
            params['processDefinitionKey'] = process_definition_key
            
        response = requests.get(
            url,
            params=params,
            auth=self.auth
        )
        response.raise_for_status()
        return response.json()
    
    def delete_process_instance(self, process_instance_id, delete_reason="Script cleanup"):
        """Delete a specific process instance"""
        url = f"{self.camunda_url}/engine-rest/process-instance/{process_instance_id}"
        
        response = requests.delete(
            url,
            json={
                "deleteReason": delete_reason,
                "skipCustomListeners": True,
                "skipIoMappings": True
            },
            auth=self.auth
        )
        
        if response.status_code == 204:
            print(f"Successfully deleted process instance {process_instance_id}")
            return True
        else:
            print(f"Failed to delete process instance {process_instance_id}: {response.text}")
            return False
    
    def kill_all_processes(self, process_definition_key=None, delete_reason="Script cleanup"):
        """Delete all running process instances (optionally filtered by process definition key)"""
        instances = self.get_running_process_instances(process_definition_key)
        
        if not instances:
            print("No running process instances found")
            return
        
        print(f"Found {len(instances)} running process instances")
        
        success_count = 0
        for instance in instances:
            if self.delete_process_instance(instance['id'], delete_reason):
                success_count += 1
        
        print(f"Successfully deleted {success_count}/{len(instances)} process instances")


# Example usage
if __name__ == "__main__":
    # Configure these values
    CAMUNDA_URL = "http://localhost:8080"
    USERNAME = "demo"
    PASSWORD = "demo"
    PROCESS_DEFINITION_KEY = None  # Set to None to kill all processes, or specify a key
    
    killer = CamundaProcessKiller(CAMUNDA_URL, USERNAME, PASSWORD)
    killer.kill_all_processes(process_definition_key=PROCESS_DEFINITION_KEY)