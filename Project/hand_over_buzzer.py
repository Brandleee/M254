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
    worker.subscribe("hand_over_signal", handle_signal)

def handle_signal(task: ExternalTask) -> TaskResult:
    print(f"TaskID ist {task.get_task_id()}")

    set_signal = True

    orderNumber = task.get_variable("orderNumber")
    print(f"***** Signal '{orderNumber}' wurde vorgegeben")

    return task.complete({"orderNumber": orderNumber})

if __name__ == '__main__':
    main()