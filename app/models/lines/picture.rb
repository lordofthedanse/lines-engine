module Lines  
  class Picture < Lines::ApplicationRecord
    include PictureUploader::Attachment(:picture)
    
    # Associations    
    belongs_to :article, touch: true, optional: true

    # Callbacks
    before_create :default_name

    # Returns the default name fo a picture
    def default_name
      self.name ||= File.basename(image.filename, '.*').titleize if image
    end

  end
end
