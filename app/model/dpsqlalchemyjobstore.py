
from __future__ import absolute_import

from apscheduler.jobstores.base import BaseJobStore, JobLookupError, ConflictingIdError
from apscheduler.util import maybe_ref, datetime_to_utc_timestamp, utc_timestamp_to_datetime
from apscheduler.job import Job
import time
try:
    import cPickle as pickle
except ImportError:  # pragma: nocover
    import pickle

try:
    from sqlalchemy import (
        create_engine, Table, Column, MetaData, Unicode, Float, LargeBinary, select)
    from sqlalchemy.exc import IntegrityError
    from sqlalchemy.sql.expression import null
except ImportError:  # pragma: nocover
    raise ImportError('SQLAlchemyJobStore requires SQLAlchemy installed')

from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore


#系统自带的jobstore由于在job报错时，会把job删掉，这不是我们想要的结果，所以
#我们重写了_get_jobs方法

class DpSQLAlchemyJobStore(SQLAlchemyJobStore):

    def __init__(self, url=None, engine=None, tablename='apscheduler_jobs', metadata=None,
                 pickle_protocol=pickle.HIGHEST_PROTOCOL, tableschema=None, engine_options=None):

        super(DpSQLAlchemyJobStore,self).__init__(url=url,engine=engine,tableschema=tableschema,metadata=metadata,
                                                  pickle_protocol=pickle.HIGHEST_PROTOCOL,tablename=tablename,engine_options=engine_options
                                                  )

    def _get_jobs(self, *conditions):
        jobs = []
        selectable = select([self.jobs_t.c.id, self.jobs_t.c.job_state]).\
            order_by(self.jobs_t.c.next_run_time)
        selectable = selectable.where(*conditions) if conditions else selectable
        failed_job_ids = set()
        for row in self.engine.execute(selectable):
            try:
                jobs.append(self._reconstitute_job(row.job_state))
            except BaseException:
                self._logger.exception('Unable to restore job "%s"', row.id)
                time.sleep(5)
                failed_job_ids.add(row.id)

        # Remove all the jobs we failed to restore
        #以下三行是我们注掉的代码
        #if failed_job_ids:
        #    delete = self.jobs_t.delete().where(self.jobs_t.c.id.in_(failed_job_ids))
        #    self.engine.execute(delete)
#
        return jobs

