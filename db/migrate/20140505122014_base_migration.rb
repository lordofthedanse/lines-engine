class BaseMigration < ActiveRecord::Migration[6.0]
  def change

    create_table :lines_articles, id: :uuid do |t|
      t.string :title
      t.string :sub_title
      t.text :content
      t.text :teaser
      t.boolean :published, default: false
      t.datetime :published_at
      t.text :hero_image_data
      t.string :slug
      t.boolean :featured, default: false
      t.text :document_data

      t.timestamps
    end

    add_index :lines_articles, :slug, name: "index_lines_articles_on_slug", unique: true

    create_table "lines_authorables", id: :uuid do |t|
      t.uuid :author_id, null: false
      t.uuid :article_id, null: false

      t.timestamps
    end

    add_index :lines_authorables, :article_id, name: "index_lines_authorables_on_article_id"
    add_index :lines_authorables, :author_id, name: "index_lines_authorables_on_author_id"

    create_table :lines_authors, id: :uuid do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.text :description, null: false

      t.timestamps
    end

    create_table :friendly_id_slugs, id: :uuid do |t|
      t.string :slug, null: false
      t.uuid :sluggable_id, null: false
      t.string :sluggable_type, limit: 40

      t.timestamps
    end

    add_index :friendly_id_slugs, [:slug, :sluggable_type], name: "index_friendly_id_slugs_on_slug_and_sluggable_type", unique: true
    add_index :friendly_id_slugs, :sluggable_id, name: "index_friendly_id_slugs_on_sluggable_id"
    add_index :friendly_id_slugs, :sluggable_type, name: "index_friendly_id_slugs_on_sluggable_type"

    create_table :lines_pictures, id: :uuid do |t|
      t.text :image_data, null: false
      t.string :name
      t.uuid :article_id, null: false
      t.timestamps
    end

    add_index :lines_pictures, :article_id, name: "index_lines_pictures_on_article_id"

    create_table :lines_users, id: :uuid do |t|
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :reset_digest
      t.datetime :reset_sent_at

      t.timestamps
    end

    create_table :tags, id: :uuid do |t|
      t.string :name
      t.integer :taggings_count, default: 0

      t.timestamps
    end

    add_index :tags, :name, unique: true

    create_table :taggings, id: :uuid do |t|
      t.references :tag, type: :uuid
      t.references :taggable, type: :uuid, polymorphic: true
      t.references :tagger, type: :uuid, polymorphic: true
      t.string :context, limit: 128

      t.timestamps
    end

    add_index :taggings, [:tag_id, :taggable_id, :taggable_type, :context, :tagger_id, :tagger_type], unique: true, name: 'taggings_idx'
  end
end
