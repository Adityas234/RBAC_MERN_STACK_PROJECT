import { useEffect, useState } from "react";

import API from "../services/api";

import Layout from "../components/Layout";

export default function Logs() {

  const [logs, setLogs] = useState([]);

  useEffect(() => {

    fetchLogs();

  }, []);

  const fetchLogs = async () => {

    try {

      const res = await API.get("/logs");

      setLogs(res.data);

    }

    catch (err) {

      console.log(err);

    }

  };

  return (

    <Layout>

      <h1 className="page-title">

        📜 Audit Logs

      </h1>

      <p className="page-subtitle">

        Track system activity

      </p>

      {logs.length === 0 ? (

        <div className="card">

          No logs available

        </div>

      ) : (

        <table

          className="table"

        >

          <thead>

            <tr>

              <th>

                Action

              </th>

              <th>

                Target

              </th>

              <th>

                Date

              </th>

              <th>

                Organization

              </th>

            </tr>

          </thead>

          <tbody>

            {logs.map((log) => (

              <tr key={log._id}>

                <td>

                  {log.action}

                </td>

                <td>

                  {log.target}

                </td>

                <td>

                  {new Date(

                    log.createdAt

                  ).toLocaleString()}

                </td>

                <td>

                  {log.organizationId}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </Layout>

  );

}