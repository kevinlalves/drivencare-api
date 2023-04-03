--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: appointment_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.appointment_status AS ENUM (
    'scheduled',
    'canceled_by_patient',
    'canceled_by_doctor',
    'completed',
    'no_show'
);


--
-- Name: week_day; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.week_day AS ENUM (
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thrusday',
    'friday',
    'saturday'
);


--
-- Name: check_appointment_date_consistency(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_appointment_date_consistency() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    ws_day_of_week TEXT;
BEGIN
    SELECT day_of_week
    INTO ws_day_of_week
    FROM weekly_schedules
    WHERE id = NEW.weekly_schedule_id;

    IF ws_day_of_week <> LOWER(to_char(NEW.date, 'Day')) THEN
        RAISE EXCEPTION 'Appointment date and day of the week in weekly_schedules do not match';
    END IF;

    RETURN NEW;
END;
$$;


--
-- Name: check_overlapping_schedules(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_overlapping_schedules() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT *
    FROM weekly_schedules
    WHERE doctor_specialty_id = NEW.doctor_specialty_id
    AND day_of_week = NEW.day_of_week
    AND NOT (
      start_time > NEW.end_time
      OR end_time < NEW.start_time
    )
  ) THEN
    RAISE EXCEPTION 'Overlapping schedule detected';
  END IF;
  RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.appointments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    patient_id uuid NOT NULL,
    weekly_schedule_id uuid NOT NULL,
    date date NOT NULL,
    status public.appointment_status DEFAULT 'scheduled'::public.appointment_status NOT NULL,
    rating real,
    review text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    finished_at timestamp with time zone
);


--
-- Name: doctor_specialties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.doctor_specialties (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    doctor_id uuid NOT NULL,
    specialty_id uuid NOT NULL,
    months_of_experience integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: doctors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.doctors (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    license_number text NOT NULL
);


--
-- Name: patients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.patients (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    emergency_contact_name text NOT NULL,
    emergency_contact_phone character varying(15) NOT NULL,
    insurance_provider text,
    insurance_number text,
    allergies text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: schedule_exceptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schedule_exceptions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    weekly_schedule_id uuid NOT NULL,
    date date NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: specialties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.specialties (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    slug text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    slug text NOT NULL,
    name text NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    document text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    picture text,
    phone character varying(15) NOT NULL,
    role_slug text NOT NULL
);


--
-- Name: weekly_schedules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.weekly_schedules (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    doctor_specialty_id uuid NOT NULL,
    day_of_week public.week_day NOT NULL,
    start_time time with time zone NOT NULL,
    end_time time with time zone NOT NULL,
    CONSTRAINT time_consistency CHECK ((end_time > start_time))
);


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.appointments VALUES ('ad3ecbb2-b920-47db-9218-d2234433ee4e', '4d3a2045-2cc9-4c7e-a1b0-215bf5c7c1ec', '2b5f0adb-acef-46a1-abeb-0b454cb4bc62', '2023-04-03', 'scheduled', NULL, NULL, '2023-04-02 19:15:59.813193+00', NULL);
INSERT INTO public.appointments VALUES ('35773bee-2316-4f7f-a56c-d8b3cfe91992', '4d3a2045-2cc9-4c7e-a1b0-215bf5c7c1ec', '2b5f0adb-acef-46a1-abeb-0b454cb4bc62', '2023-04-04', 'scheduled', NULL, NULL, '2023-04-02 20:59:29.627919+00', NULL);


--
-- Data for Name: doctor_specialties; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.doctor_specialties VALUES ('9834156b-976a-42b1-bc5e-f47e11167708', '6b3a2d07-01b6-46a6-a3e5-11a3e03f4ee9', '4401212d-168b-4cfb-982c-bb9f8e210bbd', 12, '2023-04-01 23:28:41.220166+00');
INSERT INTO public.doctor_specialties VALUES ('784c1d1b-b652-4af0-b182-91162893fba3', '34849e5e-b145-40b9-a27e-169dbb258108', '4401212d-168b-4cfb-982c-bb9f8e210bbd', 12, '2023-04-02 03:12:27.786785+00');
INSERT INTO public.doctor_specialties VALUES ('472e0f3b-0452-4244-856c-96799cabe031', '34849e5e-b145-40b9-a27e-169dbb258108', 'a3e4bb9f-f060-4a7a-9279-88a8028e8a4d', 7, '2023-04-02 03:38:47.39068+00');


--
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.doctors VALUES ('6b3a2d07-01b6-46a6-a3e5-11a3e03f4ee9', '604a207f-10a3-4671-8865-9fb690aecda2', '122-SP');
INSERT INTO public.doctors VALUES ('34849e5e-b145-40b9-a27e-169dbb258108', '025611ba-cc39-4339-92b1-12385a5d080f', '1322-SP');


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.patients VALUES ('d688d76b-c250-4b88-b49a-729c177017b4', '43d94fb2-78af-463b-842e-78c2cbf2aa28', 'Joao', '1244773343', NULL, NULL, 'shrimp and other sea foods', '2023-04-01 23:29:14.091423+00');
INSERT INTO public.patients VALUES ('4d3a2045-2cc9-4c7e-a1b0-215bf5c7c1ec', 'b56d328b-e865-4726-af1b-ecca93e3a6d5', 'Joao', '1244773343', NULL, NULL, 'boredom!', '2023-04-02 16:20:31.036519+00');


--
-- Data for Name: schedule_exceptions; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: specialties; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.specialties VALUES ('a3e4bb9f-f060-4a7a-9279-88a8028e8a4d', 'quiroprata', '2023-04-01 16:49:30.149899+00', 'Quiroprata');
INSERT INTO public.specialties VALUES ('4401212d-168b-4cfb-982c-bb9f8e210bbd', 'nutritionist', '2023-04-01 17:21:25.956868+00', 'Nutricionista');


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.user_roles VALUES ('95aa89bc-dde1-4544-a68c-b0c3ebf1a4f2', 'doctor', 'Médico');
INSERT INTO public.user_roles VALUES ('810bfc46-306a-48c4-9471-49e597115137', 'patient', 'Paciente');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES ('604a207f-10a3-4671-8865-9fb690aecda2', 'Jane Jatoba', 'janeba@gmail.com', '$2b$10$QD6POh6E8IU438oWseXtaeZQRdewWoW8mj6d37FJHeQezQyo5UM0u', '23439201062', '2023-04-01 23:28:41.220166+00', '2023-04-01 23:28:41.220166+00', NULL, '12977777778', 'doctor');
INSERT INTO public.users VALUES ('43d94fb2-78af-463b-842e-78c2cbf2aa28', 'Kevin Alves', 'kev@gmail.com', '$2b$10$15vTk2OthUjFDJhlLj0nouwMBvz35pWWkkULrCKoSnEc5vIOMnwqy', '18540469006', '2023-04-01 23:29:14.091423+00', '2023-04-01 23:29:14.091423+00', NULL, '11944448888', 'patient');
INSERT INTO public.users VALUES ('025611ba-cc39-4339-92b1-12385a5d080f', 'Kevin Alves', 'kevin.alves.dev@gmail.com', '$2b$10$qBq/JepAjEJCUwZz.uNCGOXL2K8s89YXUS.rRnIgG/wccC78H/Yca', '23439201002', '2023-04-02 03:12:27.786785+00', '2023-04-02 03:12:27.786785+00', NULL, '12977777378', 'doctor');
INSERT INTO public.users VALUES ('b56d328b-e865-4726-af1b-ecca93e3a6d5', 'Ivane Alves', 'vilma@gmail.com', '$2b$10$tr/InHbjoozAyxnJ7uRyUO15U7AmPp9CuaHYZP/f3QKAvPnKBYTWC', '18540469017', '2023-04-02 16:20:31.036519+00', '2023-04-02 16:20:31.036519+00', NULL, '11944448877', 'patient');


--
-- Data for Name: weekly_schedules; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.weekly_schedules VALUES ('2b5f0adb-acef-46a1-abeb-0b454cb4bc62', '472e0f3b-0452-4244-856c-96799cabe031', 'friday', '12:00:00+00', '13:00:00+00');
INSERT INTO public.weekly_schedules VALUES ('1e6454d7-ea8c-48b6-9e59-3f4efc245181', '472e0f3b-0452-4244-856c-96799cabe031', 'saturday', '12:00:00+00', '13:00:00+00');


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: doctor_specialties doctor_specialties_doctor_id_specialty_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor_specialties
    ADD CONSTRAINT doctor_specialties_doctor_id_specialty_id_key UNIQUE (doctor_id, specialty_id);


--
-- Name: doctor_specialties doctor_specialties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor_specialties
    ADD CONSTRAINT doctor_specialties_pkey PRIMARY KEY (id);


--
-- Name: doctors doctors_license_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_license_number_key UNIQUE (license_number);


--
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);


--
-- Name: doctors doctors_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_user_id_key UNIQUE (user_id);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- Name: patients patients_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_user_id_key UNIQUE (user_id);


--
-- Name: schedule_exceptions schedule_exceptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedule_exceptions
    ADD CONSTRAINT schedule_exceptions_pkey PRIMARY KEY (id);


--
-- Name: specialties specialties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialties
    ADD CONSTRAINT specialties_pkey PRIMARY KEY (id);


--
-- Name: specialties specialties_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialties
    ADD CONSTRAINT specialties_slug_key UNIQUE (slug);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_slug_key UNIQUE (slug);


--
-- Name: users users_document_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_document_key UNIQUE (document);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: weekly_schedules weekly_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.weekly_schedules
    ADD CONSTRAINT weekly_schedules_pkey PRIMARY KEY (id);


--
-- Name: appointments_weekly_schedules_id_date_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX appointments_weekly_schedules_id_date_key ON public.appointments USING btree (weekly_schedule_id, date);


--
-- Name: schedule_exceptions_weekly_schedule_id_date_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX schedule_exceptions_weekly_schedule_id_date_key ON public.schedule_exceptions USING btree (weekly_schedule_id, date);


--
-- Name: specialties_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX specialties_name_key ON public.specialties USING gin (name public.gin_trgm_ops);


--
-- Name: appointments check_appointment_date_consistency_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER check_appointment_date_consistency_trigger BEFORE INSERT OR UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.check_appointment_date_consistency();


--
-- Name: weekly_schedules check_overlapping_schedules_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER check_overlapping_schedules_trigger BEFORE INSERT OR UPDATE ON public.weekly_schedules FOR EACH ROW EXECUTE FUNCTION public.check_overlapping_schedules();


--
-- Name: appointments appointments_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id);


--
-- Name: appointments appointments_weekly_schedule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_weekly_schedule_id_fkey FOREIGN KEY (weekly_schedule_id) REFERENCES public.weekly_schedules(id);


--
-- Name: doctor_specialties doctor_specialties_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor_specialties
    ADD CONSTRAINT doctor_specialties_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: doctor_specialties doctor_specialties_specialty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor_specialties
    ADD CONSTRAINT doctor_specialties_specialty_id_fkey FOREIGN KEY (specialty_id) REFERENCES public.specialties(id) ON DELETE CASCADE;


--
-- Name: doctors doctors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: patients patients_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: schedule_exceptions schedule_exceptions_weekly_schedule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedule_exceptions
    ADD CONSTRAINT schedule_exceptions_weekly_schedule_id_fkey FOREIGN KEY (weekly_schedule_id) REFERENCES public.weekly_schedules(id);


--
-- Name: users users_role_slug_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_slug_fkey FOREIGN KEY (role_slug) REFERENCES public.user_roles(slug) ON DELETE RESTRICT;


--
-- Name: weekly_schedules weekly_schedules_doctor_specialty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.weekly_schedules
    ADD CONSTRAINT weekly_schedules_doctor_specialty_id_fkey FOREIGN KEY (doctor_specialty_id) REFERENCES public.doctor_specialties(id);


--
-- PostgreSQL database dump complete
--

