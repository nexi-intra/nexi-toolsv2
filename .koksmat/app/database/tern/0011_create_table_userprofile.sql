/* 
File have been automatically created. To prevent the file from getting overwritten
set the Front Matter property ´keep´ to ´true´ syntax for the code snippet
---
keep: true
---
 */
-- sure sild
CREATE TABLE
    public.userprofile (
        id SERIAL PRIMARY KEY,
        created_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by character varying COLLATE pg_catalog."default",
            updated_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by character varying COLLATE pg_catalog."default",
            deleted_at timestamp
        with
            time zone,
            koksmat_masterdataref VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_id VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_etag VARCHAR COLLATE pg_catalog."default",
            koksmat_compliancetag VARCHAR COLLATE pg_catalog."default",
            koksmat_state VARCHAR COLLATE pg_catalog."default",
            koksmat_bucket JSONB,
            tenant character varying COLLATE pg_catalog."default" NOT NULL,
            searchindex character varying COLLATE pg_catalog."default" NOT NULL,
            name character varying COLLATE pg_catalog."default" NOT NULL,
            description character varying COLLATE pg_catalog."default",
            Translations JSONB,
            email character varying COLLATE pg_catalog."default",
            firstname character varying COLLATE pg_catalog."default",
            lastname character varying COLLATE pg_catalog."default" NOT NULL,
            language_id int,
            country_id int,
            region_id int,
            status character varying COLLATE pg_catalog."default"
    );

ALTER TABLE IF EXISTS public.userprofile ADD FOREIGN KEY (language_id) REFERENCES public.language (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

ALTER TABLE IF EXISTS public.userprofile ADD FOREIGN KEY (country_id) REFERENCES public.country (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

ALTER TABLE IF EXISTS public.userprofile ADD FOREIGN KEY (region_id) REFERENCES public.region (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

-- lollipop
CREATE TABLE
    public.userprofile_m2m_tool (
        id SERIAL PRIMARY KEY,
        created_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by character varying COLLATE pg_catalog."default",
            updated_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by character varying COLLATE pg_catalog."default",
            deleted_at timestamp
        with
            time zone,
            koksmat_masterdataref VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_id VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_etag VARCHAR COLLATE pg_catalog."default",
            koksmat_compliancetag VARCHAR COLLATE pg_catalog."default",
            koksmat_state VARCHAR COLLATE pg_catalog."default",
            koksmat_bucket JSONB,
            userprofile_id int,
            tool_id int
    );

ALTER TABLE public.userprofile_m2m_tool ADD FOREIGN KEY (userprofile_id) REFERENCES public.userprofile (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

ALTER TABLE public.userprofile_m2m_tool ADD FOREIGN KEY (tool_id) REFERENCES public.tool (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

-- lollipop
CREATE TABLE
    public.userprofile_m2m_userrole (
        id SERIAL PRIMARY KEY,
        created_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by character varying COLLATE pg_catalog."default",
            updated_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by character varying COLLATE pg_catalog."default",
            deleted_at timestamp
        with
            time zone,
            koksmat_masterdataref VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_id VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_etag VARCHAR COLLATE pg_catalog."default",
            koksmat_compliancetag VARCHAR COLLATE pg_catalog."default",
            koksmat_state VARCHAR COLLATE pg_catalog."default",
            koksmat_bucket JSONB,
            userprofile_id int,
            userrole_id int
    );

ALTER TABLE public.userprofile_m2m_userrole ADD FOREIGN KEY (userprofile_id) REFERENCES public.userprofile (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

ALTER TABLE public.userprofile_m2m_userrole ADD FOREIGN KEY (userrole_id) REFERENCES public.userrole (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

-- lollipop
CREATE TABLE
    public.userprofile_m2m_accesspoint (
        id SERIAL PRIMARY KEY,
        created_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by character varying COLLATE pg_catalog."default",
            updated_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by character varying COLLATE pg_catalog."default",
            deleted_at timestamp
        with
            time zone,
            koksmat_masterdataref VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_id VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_etag VARCHAR COLLATE pg_catalog."default",
            koksmat_compliancetag VARCHAR COLLATE pg_catalog."default",
            koksmat_state VARCHAR COLLATE pg_catalog."default",
            koksmat_bucket JSONB,
            userprofile_id int,
            accesspoint_id int
    );

ALTER TABLE public.userprofile_m2m_accesspoint ADD FOREIGN KEY (userprofile_id) REFERENCES public.userprofile (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

ALTER TABLE public.userprofile_m2m_accesspoint ADD FOREIGN KEY (accesspoint_id) REFERENCES public.accesspoint (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

-- lollipop
CREATE TABLE
    public.userprofile_m2m_usergroup (
        id SERIAL PRIMARY KEY,
        created_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by character varying COLLATE pg_catalog."default",
            updated_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by character varying COLLATE pg_catalog."default",
            deleted_at timestamp
        with
            time zone,
            koksmat_masterdataref VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_id VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_etag VARCHAR COLLATE pg_catalog."default",
            koksmat_compliancetag VARCHAR COLLATE pg_catalog."default",
            koksmat_state VARCHAR COLLATE pg_catalog."default",
            koksmat_bucket JSONB,
            userprofile_id int,
            usergroup_id int
    );

ALTER TABLE public.userprofile_m2m_usergroup ADD FOREIGN KEY (userprofile_id) REFERENCES public.userprofile (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

ALTER TABLE public.userprofile_m2m_usergroup ADD FOREIGN KEY (usergroup_id) REFERENCES public.usergroup (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

---- create above / drop below ----
DROP TABLE IF EXISTS public.userprofile_m2m_tool;

DROP TABLE IF EXISTS public.userprofile_m2m_userrole;

DROP TABLE IF EXISTS public.userprofile_m2m_accesspoint;

DROP TABLE IF EXISTS public.userprofile_m2m_usergroup;

DROP TABLE public.userprofile;