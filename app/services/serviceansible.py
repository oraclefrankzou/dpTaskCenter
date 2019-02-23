from ansible.inventory.manager import InventoryManager
from ansible.playbook.play import Play
from ansible.executor.task_queue_manager import TaskQueueManager
from ansible.vars.manager import VariableManager
from ansible.parsing.dataloader import DataLoader
from collections import namedtuple
import json
from ansible.plugins.callback import CallbackBase


class ResultCallback(CallbackBase):
    """A sample callback plugin used for performing an action as results come in

    If you want to collect all results into a single object for processing at
    the end of the execution, look into utilizing the ``json`` callback plugin
    or writing your own custom callback plugin

    """

    def __init__(self):
        self.res = None

    def v2_runner_on_ok(self, result, **kwargs):
        """Print a json representation of the result
        This method could store the result in an instance attribute for retrieval later
        """
        global exec_result
        host = result._host
        self.data = json.dumps({host.name: result._result}, indent=4)
        exec_result = dict(result._result, **json.loads(self.data))



class ServiceAnsible():

    from ansible.inventory.manager import InventoryManager
    from ansible.playbook.play import Play
    from ansible.executor.task_queue_manager import TaskQueueManager
    from ansible.vars.manager import VariableManager
    from ansible.parsing.dataloader import DataLoader
    from collections import namedtuple
    import json
    from ansible.plugins.callback import CallbackBase

    def __init__(self,module,args=None):
        self.module=module
        self.args=args

    def exec_ansible(self, host):
        Options = namedtuple('Options',
                             ['connection', 'module_path', 'forks', 'become', 'become_method', 'become_user', 'check',
                              'diff'])
        # initialize needed objects
        loader = DataLoader()
        options = Options(connection='ssh', module_path='/usr/local/python3/lib/python3.6/site-packages/', forks=100,
                          become=None, become_method=None, become_user=None, check=False, diff=False)
        passwords = dict(vault_pass='secret')

        results_callback = ResultCallback()
        # create inventory and pass to var manager
        inventory = InventoryManager(loader=loader, sources=[])
        variable_manager = VariableManager(loader=loader, inventory=inventory)

        # create play with tasks
        play_source = dict(
            name="Ansible Play",
            hosts=host,
            gather_facts='no',
            tasks=[
                dict(action=dict(module=self.module, args=self.args), register='shell_out'),
            ]
        )
        play = Play().load(play_source, variable_manager=variable_manager, loader=loader)

        stdout_callback = results_callback
        tqm = None
        global exec_result
        try:
            tqm = TaskQueueManager(
                inventory=inventory,
                variable_manager=variable_manager,
                loader=loader,
                options=options,
                passwords=passwords,
                stdout_callback=results_callback,
            )
            result = tqm.run(play)

        finally:
            if tqm is not None:
                tqm.cleanup()
            return exec_result
