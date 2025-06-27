from camunda.external_task.external_task import ExternalTask, TaskResult
from camunda.external_task.external_task_worker import ExternalTaskWorker

config = {
    "maxTasks": 5,
    "lockDuration": 10000,
    "asyncResponseTimeout": 5000,
    "retries": 3,
    "retryTimeout": 5000,
    "sleepSeconds": 30
}

def main():
    worker = ExternalTaskWorker(worker_id="1", config=config)
    worker.subscribe("hand_over_buzzer", handle_buzzer)

def handle_buzzer(task: ExternalTask) -> TaskResult:
    print(f"TaskID ist {task.get_task_id()}")

    set_buzzer = True

    orderNumber = task.get_variable("orderNumber")
    print(f"***** Buzzer '{orderNumber}' wurde vorgegeben")

    return task.complete({"orderNumerus": orderNumber})

if __name__ == '__main__':
    main()
